const { Server } = require('socket.io');
const io = new Server({ cors: { origin: '*' } });
const config = require('config')
const jwt = require('jsonwebtoken')
const controllers = require('./controllers');
var Socket = {
    emit: function (event, data) {
        console.log("************* Socket Emit *************************")
        if (event != "getLog") console.log("EventId:::::::", event, "--------->", data)
        io.sockets.emit(event, data);
    },
    emitToRoom: function (room, event, data) {
        console.log("************* Socket Emit *************************")
        console.log("RoomId::::::::", room)
        console.log("EventId:::::::", event, "--------->", data)
        io.to(room).emit(event, data);
    }
};

let Users = {

}




io.use(async (socket, next) => {
    try {
        if (socket.handshake.query && socket.handshake.query.id) {
            Users[String(socket.id)] = socket.handshake.query.id
            next()
        }
        else if (socket.handshake.query && socket.handshake.query.token) {
            let decoded = jwt.verify(socket.handshake.query.token, config.get("JWT_OPTIONS").SECRET_KEY);
            if (!decoded) {
                console.log('Socket Authentication error')
                socket.disconnect(true);
            }
            else {
                Users[String(socket.id)] = decoded._id
                next();
            }
        }
        else if (socket.handshake.query.type == "monitoring") {
            next()
        }
        else {
            console.log('Socket Authentication error')
            socket.disconnect(true);
        }
    }
    catch (error) {
        console.log('Socket Authentication error')
        socket.disconnect(true);
    }
}).on("connection", function (socket) {
    console.log("************ User Attached **********")

    socket.on("connectOk", async (data) => {
        try {
            let userId = Users[String(socket.id)]
            console.log("************ User Connect **********", socket.id, userId)
            socket.join(userId);
            io.to(userId).emit("connectOk", { status: 200, message: "Socket connected", data: {} });
        } catch (error) {
            console.log(error)
        }
    });

    socket.on("disconnectOk", async (data) => {
        try {
            console.log("************ User disConnect **********", socket.id, Users[String(socket.id)], userId)
            let userId = Users[String(socket.id)]
            socket.leave(userId);
            delete Users[String(socket.id)]
            io.to(userId).emit("disconnectOk", { status: 200, message: "Socket disconnected", data: {} });
        } catch (error) {
            console.log(error)
        }
    })


    socket.on("sendMessage", async (data) => {
        try {
            console.log("************ User sendMessage Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = { ...data }
            payload.reciever = payload.userId
            delete payload.userId
            payload.sender = Users[String(socket.id)]
            let result = await controllers.sendMessage(payload)
            io.to(Users[String(socket.id)]).emit('sendMessage', result)
            io.to(String(data.userId)).emit('recieveMessage', result)
        } catch (error) {
            console.log(error)
        }
    })


    socket.on("getChatList", async (data) => {
        try {
            console.log("************ User getChatList Socket **********", socket.id, Users[String(socket.id)], data)

            let result = await controllers.getChatList(Users[String(socket.id)])
            io.to(Users[String(socket.id)]).emit('getChatList', result)
        } catch (error) {
            console.log(error)
        }
    })
    socket.on("getChatId", async (data) => {
        try {
            console.log("************ User getChatId Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = { ...data }
            payload.userId = parseInt(payload.userId)
            payload.user = parseInt(Users[String(socket.id)])
            let result = await controllers.getChatId(payload)
            if (result.data && result.data._id) {
                result.data = { "chatId": result.data._id }
            }
            else {
                result.data = { "chatId": null }
            }
            io.to(Users[String(socket.id)]).emit('getChatId', result)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("getMessages", async (data) => {
        try {
            console.log("************ User getMessages Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = { ...data }
            let result = await controllers.getMessages(payload)
            io.to(Users[String(socket.id)]).emit('getMessages', result)
        } catch (error) {
            console.log(error)
        }
    })

});
exports.Socket = Socket;
exports.io = io;