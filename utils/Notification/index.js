const FCM = require('fcm-node');
const config = require("config");
const token = config.get("FCM_TOKEN");
const fcm = new FCM(token);
const EUMS = require('../../constants').ENUMS

module.exports = {
    pushNotification: async (deviceType, deviceToken, title, body, data) => {
        let message = {}
        if (deviceType == EUMS.DEVICES[0]) {
            message = { to: deviceToken, collapse_key: 'random', data: data, priority: "high" };
        }
        else { message = { to: deviceToken, collapse_key: 'random', notification: { title: title, body: body, sound: "default" }, data: data } }
        // console.log("Push Notification -------> ", message)
        fcm.send(message, function (err, response) { if (err) { console.log("Something has gone wrong with Push Notifictaion!", err); return} });
    }
};