const Server = require('socket.io');
const io = new Server();
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
            console.log('Socket connected')
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

    socket.on("like", async (data) => {
        try {
            console.log("************ User Like Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = {}
            payload.userId = Users[String(socket.id)]
            payload.matchedUserId = data.userId
            let sendObj = await controllers.like(payload)
            io.to(payload.userId).emit("like", sendObj);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("disLike", async (data) => {
        try {
            console.log("************ User DisLike Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = {}
            payload.userId = Users[String(socket.id)]
            payload.matchedUserId = data.userId
            let sendObj = await controllers.disLike(payload)
            io.to(payload.userId).emit("disLike", sendObj);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("undoRequest", async (data) => {
        try {
            console.log("************ User undoRequest Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = {}
            payload.userId = Users[String(socket.id)]
            let sendObj = await controllers.undoRequest(payload)
            io.to(payload.userId).emit("undoRequest", sendObj);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("acceptMatch", async (data) => {
        try {
            console.log("************ User acceptMatch Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = {}
            payload.userId = Users[String(socket.id)]
            payload._id = data.matchId
            let sendObj = await controllers.acceptMatch(payload)
            io.to(Users[String(socket.id)]).emit("acceptMatch", sendObj);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("rejectMatch", async (data) => {
        try {
            console.log("************ User rejectMatch Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = {}
            payload.userId = Users[String(socket.id)]
            let sendObj = await controllers.rejectMatch(payload)
            io.to(payload.userId).emit("rejectMatch", sendObj);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("deleteMatch", async (data) => {
        try {
            console.log("************ User deleteMatch Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = {}
            payload.unMatchedBy = Users[String(socket.id)]
            payload.unMatched = data.userId
            payload.chatId = data.chatId
            let sendObj = await controllers.deleteMatch(payload)
            io.to(payload.unMatchedBy).emit("deleteMatch", sendObj);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("sendMessage", async (data) => {
        try {
            console.log("************ User sendMessage Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = {}
            payload.sender = Users[String(socket.id)]
            payload.data = data
            let sendObj = await controllers.sendMessage(payload)
            if (sendObj.status != 200) {
                io.to(Users[String(socket.id)]).emit("sendMessage", sendObj)
            }
            else {
                io.to(payload.data.userId).emit("recieveMessage", sendObj);
                controllers.sendMessagePushNotification(sendObj);
                sendObj.message = "MESSAGE_SENT_SUCCESSFULLY"
                io.to(payload.sender).emit("sendMessage", sendObj)
            }
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("messageRead", async (data) => {
        try {
            console.log("************ User messageRead Socket **********", socket.id, Users[String(socket.id)], data)
            let userId = Users[String(socket.id)]
            let sendObj = await controllers.messageRead(data)
            let sender = sendObj.data.sender
            delete sendObj.data.sender
            console.log(sendObj)
            io.to(sender).emit('messageRead', sendObj)
            io.to(userId).emit('messageRead', sendObj)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("typing", async (data) => {
        try {
            console.log("************ User typing Socket **********", socket.id, Users[String(socket.id)], data)
            io.to(data.userId).emit('typing', { chatId: data.chatId })
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("typingStop", async (data) => {
        try {
            console.log("************ User typingStop Socket **********", socket.id, Users[String(socket.id)], data)
            io.to(data.userId).emit('typingStop', { chatId: data.chatId })
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("blockUser", async (data) => {
        try {
            console.log("************ User block Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = { blocked: data.userId, blockedBy: Users[String(socket.id)] }
            let sendObj = await controllers.blockUser(payload)
            io.to(Users[String(socket.id)]).emit('blockUser', sendObj)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("unBlockUser", async (data) => {
        try {
            console.log("************ User Unblock Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = { blocked: data.userId, blockedBy: Users[String(socket.id)] }
            let sendObj = await controllers.unBlockUser(payload)
            io.to(Users[String(socket.id)]).emit('unBlockUser', sendObj)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("deleteChat", async (data) => {
        try {
            console.log("************ User delete Chat Socket **********", socket.id, Users[String(socket.id)], data)
            data.userId = Users[String(socket.id)];
            let sendObj = await controllers.deleteChat(data)
            console.log(sendObj)
            io.to(Users[String(socket.id)]).emit('deleteChat', sendObj)
        } catch (error) {
            console.log(error)
        }
    })

});
exports.Socket = Socket;
exports.io = io;