const { Server } = require('socket.io');
const io = new Server({ cors: { origin: '*' } });
const config = require('config')
const jwt = require('jsonwebtoken')
const controllers = require('./controllers');
const fetch = require('node-fetch');
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
            // let chatUsers = await controllers.getChatUsers(userId);
            // for(let user of chatUsers[0].users){
            //     io.to(user.user).emit("userConnected", { status: 200, message: "User Connected", data: {chatId:user.chatId ,isOnline: true} });
            // }
            let requestUrl = `https://testing.athletamedia.com/user/player/lastseen`;
            console.log(userId)
            let params = {
                "Id": userId,
                "is_online": 1
            };
            let query = Object.keys(params)
                        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                        .join('&');
            let url = requestUrl+"?" + query;
            let data = await fetch(url, {method: "POST"}).then(res => res.json());
        } catch (error) {
            console.log(error)
        }
    });

    socket.on("disconnect" , async() => {
        console.log("************ User disConnect **********", socket.id)
        try {
            console.log("************ User disConnect **********", socket.id, Users)
            let userId = Users[String(socket.id)]
            let chatUsers = await controllers.getChatUsers(userId);
            for(let user of chatUsers[0].users){
                console.log({chatId:user.chatId ,isOnline: true, time: new Date()})
                io.to(user.user).emit("userDisconnected", { status: 200, message: "Socket disconnected", data: {chatId:user.chatId ,isOnline: false, time: new Date()} });
            }
            socket.leave(parseInt(userId));
            delete Users[String(socket.id)]
            // io.to(userId).emit("disconnectOk", { status: 200, message: "Socket disconnected", data: {} });
            let requestUrl = `https://testing.athletamedia.com/user/player/lastseen`;
            let params = {
                "Id": userId,
                "time": new Date().toISOString().slice(0, 19).replace('T', ' '),
                "is_online": 0
            };
            let query = Object.keys(params)
                        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                        .join('&');
            let url = requestUrl+"?" + query;
            let data = await fetch(url, {method: "POST"}).then(res => res.json());
            console.log("--->", data)

        } catch (error) {
            console.log(error)
        }
    })

    // socket.on("disconnectOk", async (data) => {
    //     console.log(data);
    //     try {
    //         // console.log("************ User disConnect **********", socket.id, Users[String(socket.id)], userId)
    //         let userId = Users[String(socket.id)]
    //         console.log(userId)
    //         socket.leave(userId);
    //         delete Users[String(socket.id)]
    //         io.to(userId).emit("disconnectOk", { status: 200, message: "Socket disconnected", data: {} });
    //     } catch (error) {
    //         console.log(error)
    //     }
    // })


    socket.on("sendMessage", async (data) => {
        try {
            console.log("************ User sendMessage Socket **********", socket.id, Users[String(socket.id)], data)
            let payload = { ...data }
            console.log(payload);
            payload.reciever = payload.userId
            delete payload.userId
            payload.sender = Users[String(socket.id)]
            let result = await controllers.sendMessage(payload)
            io.to(Users[String(socket.id)]).emit('sendMessage', result)
            io.to(String(data.userId)).emit('recieveMessage', result)
            console.log(result)
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
                result.data = { "chatId": result.data._id, oldChatId: payload?.chatId, lastMessage: result.data.lastMessage, unReadCount: result.data.unReadCount }
            }
            else {
                result.data = { "chatId": null , oldChatId: payload?.chatId}
            }
            console.log("--->>>",result)
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

    socket.on("messageRead", async (data) => {
        try{
            console.log("************ User messageRead Socket **********", socket.id, Users[String(socket.id)], data);
            let payload = { ...data };
            payload.userId = Users[String(socket.id)]
            let result = await controllers.messageRead(payload);
            io.to(Users[String(socket.id)]).emit('messageRead', result)
        } catch (error) {
            console.log(error)
        }
    })

});
exports.Socket = Socket;
exports.io = io;