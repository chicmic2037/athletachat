const fs = require('fs')
const allRoutes = require('express-list-endpoints')
const joiToSwagger = require('joi-to-swagger');
let swagger = require('../../swagger.json')
const validations = require('../../v1/validations');
const convertJoiToSwagger = async (routes) => {
    let newRoutes = []
    for (const ind in routes) {
        for (const mind of routes[ind].methods) {
            let route = {}
            route.path = routes[ind].path
            route.method = mind.toString().toLowerCase()
            let tag = routes[ind].path.split("/")[3]
            route.tags = [tag]
            /*
            Check if Joi Schema Exists
            */
            let lastPath = routes[ind].path.split("/")[(routes[ind].path.split("/").length) - 1]
            lastPath = lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
            let isSchemaExists = route.method == 'get' && routes[ind].methods.includes('POST') ? ['validateGet' + lastPath] : routes[ind].middleware.filter((middleware) => {
                if (middleware.includes("validate")) return middleware
            });
            if (isSchemaExists.length == 1) {
                route.operationId = tag + isSchemaExists[0]
                let { example, schema, querySchema, summary, description } = await validations[tag][isSchemaExists[0]]("swagger")
                route.summary = summary
                route.description = description
                if (querySchema) {
                    querySchema = joiToSwagger(querySchema).swagger
                    route.parameters = [{
                        name: "params",
                        in: "query",
                        schema: querySchema
                    }]
                }
                if (schema) {
                    if (isSchemaExists[0].includes('Upload')) {
                        route.requestBody = {
                            content: {
                                'multipart/form-data': {
                                    schema: schema,
                                }
                            }
                        }
                    }
                    else {
                        schema = joiToSwagger(schema).swagger
                        route.requestBody = {
                            content: {
                                'application/json': {
                                    schema: schema,
                                    example: example
                                }
                            }
                        }
                    }
                }
            }
            /*
            Add Authorization to  API
            */
            let needAuthorization = routes[ind].middleware.filter((middleware) => {
                if (middleware.includes("Valid")) return middleware
            })
            if (needAuthorization.length == 1) {
                route.security = [{}]
                route.security[0][tag + "Authorization"] = []
            }
            newRoutes.push(route)
        }
    }
    return newRoutes
}

module.exports = {
    /*
Swagger Functions
*/
    generateSwagger: async (app) => {
        let swaggerData = {
            "tags": [
            ],
            "paths": {
            },
            "components": {
                "securitySchemes": {

                }
            }
        }
        let ROUTES = allRoutes(app)
        ROUTES = await convertJoiToSwagger(ROUTES)
        for (const route of ROUTES) {
            if (!swaggerData.tags.includes(route.tags[0])) swaggerData.tags.push(route.tags[0])
            let schema = {}
            schema[route.path] = {}
            schema[route.path][route.method] = {
                "tags": route.tags,
                "summary": route.summary,
                "description": route.description,
                "operationId": route.operationId,
                "parameters": route.parameters,
                "responses": {
                    "200": {
                        "description": "Success Response"
                    }
                },
                "security": route.security,
            }
            if (route.requestBody) schema[route.path][route.method]["requestBody"] = route.requestBody
            if (swaggerData.paths[route.path]) swaggerData.paths[route.path] = { ...swaggerData.paths[route.path], ...schema[route.path] }
            else swaggerData.paths = { ...swaggerData.paths, ...schema }

        }
        /*
        add Authorizations
        */
        for (const tag of swaggerData.tags) {
            swaggerData.components.securitySchemes[tag + "Authorization"] = {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header"
            }
        }
        swagger = { ...swagger, ...swaggerData }
        fs.writeFileSync('swagger.json', JSON.stringify(swagger), (err) => { if (err) throw err; })
        return

    },
}