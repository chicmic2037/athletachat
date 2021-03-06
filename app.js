/* 
Import Required Modules
*/
const config = require('config');
const mongoose = require('mongoose')
const express = require("express");
const morgan = require('morgan');
const app = express();
const cors = require("cors");
app.use(cors());
/*
Initialize Server
*/
let server = require("http").createServer(app);
server.listen(config.get('PORT'), () => {
    console.log(`****************************************** ${'ENVIRONMENT:::' + process.env.NODE_ENV} *******************************************************`);
    console.log(`****************************************** ${'PORT:::' + config.get('PORT')} *******************************************************`);
})
/*
Database Connection
*/
mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(
    (db) => console.log(`****************************************** MONGODB CONNECTED ***********************************************`),
    (err) => console.log("MongoDB " + String(err.message))
);
/* 
Socket Initialization
*/
const { io } = require("./utils/Sockets");
io.attach(server);
/* 
View Engine Setup
*/
app.set("view engine", "ejs");
/*
Middelwares
*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*
Serving Static Files
*/
app.use('/uploads', express.static(__dirname + "/uploads"));
/*
Test API
*/
app.use('/test', async (req, res, next) => {
    res.status(200).send({ status: 200, message: "TEST API", data: {} })
});
const route = require('./route');
app.use('/api', route)
/*
Catch 404 Error
*/
app.use(async (req, res, next) => {
    res.status(404).send({ status: 404, message: "Invalid Route", data: {} });
});
/*
Error Handler
*/
app.use(async (err, req, res, next) => {
    console.error(err);
    let status = err.status || 500;
    let sendObj = { status: status, message: err.message || err || "Internal Server Error", data: err }
    if (sendObj.message == "jwt expired") {
        sendObj = { status: 401, message: "UN_AUTHORIZED", data: {} }
        status = 401
    }
    await res.status(status).send(sendObj)
});