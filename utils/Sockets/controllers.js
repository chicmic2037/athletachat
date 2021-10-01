const { CODES, MESSAGES } = require("../../constants")
const MODELS = require("../../models")
const PROJECTIONS = require('../../v1/projections').socket
const Notifications = require('../Notification')
module.exports = {
    like: async (payload) => {
        try {
            let alsoLiked = await MODELS.matching.findOne({ userId: payload.matchedUserId, matchedUserId: payload.userId, status: 0 }).lean()
            if (alsoLiked) {
                await MODELS.matching.findByIdAndUpdate(alsoLiked._id, { status: 2 })
                return { status: CODES.OK, message: MESSAGES.USER_LIKED_SUCCESSFULLY, data: {} }
            }
            let matchExist = await MODELS.matching.findOne(payload).lean()
            if (matchExist && matchExist.status == 1) return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_ALREADY_DISLIKE_BY_YOU, data: {} }
            if (matchExist && matchExist.status == 0) return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_ALREADY_LIKED_BY_YOU, data: {} }
            if ((matchExist && matchExist.status == 2) || (matchExist && matchExist.status == 3)) return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_ALREADY_MATCHED_WITH_YOU, data: {} }
            payload.status = 0
            await MODELS.matching(payload).save()
            return { status: CODES.OK, message: MESSAGES.USER_LIKED_SUCCESSFULLY, data: {} }
        }
        catch (error) {
            console.log(error)
        }

    },
    disLike: async (payload) => {
        try {
            let matchExist = await MODELS.matching.findOne(payload).lean()
            if (matchExist.status == 1) return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_ALREADY_DISLIKE_BY_YOU, data: {} }
            if (matchExist.status == 0) return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_ALREADY_LIKED_BY_YOU, data: {} }
            if (matchExist.status == 2) return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_ALREADY_MATCHED_WITH_YOU, data: {} }
            payload.status = 1
            await MODELS.matching(payload).save()
            return { status: CODES.OK, message: MESSAGES.USER_DISLIKED_SUCCESSFULLY, data: {} }
        }
        catch (error) {
            console.log(error)
        }

    },
    undoRequest: async (payload) => {
        try {
            let matchExist = await MODELS.matching.findOne(payload).sort({ createdAt: -1 }).lean()
            if (matchExist.status == 0 || matchExist.status == 1 || matchExist.status == 2) {
                await MODELS.matching.findByIdAndDelete(matchExist._id)
                return { status: CODES.OK, message: MESSAGES.UNDO_REQUEST_SUCCESSFULLY, data: {} }
            }
            return { status: CODES.BAD_REQUEST, message: MESSAGES.INVALID_REQUEST, data: {} }
        }
        catch (error) {
            console.log(error)
        }

    },
    acceptMatch: async (payload) => {
        try {
            payload._id = MODELS.ObjectId(payload._id)
            let setObj = await MODELS.matching.findOne({ _id: payload._id }).lean()
            setObj = {
                user1: setObj.userId,
                user2: setObj.matchedUserId
            }
            let chat = await MODELS.chat.findOne({ ...setObj, isDeleted: false }).lean().exec();
            if (!chat) chat = await MODELS.chat(setObj).save();
            await MODELS.matching.findOneAndUpdate({ _id: payload._id }, { status: 3 })
            return { status: CODES.OK, message: MESSAGES.MATCH_ACCEPTED_SUCCESSFULLY, data: { chat: { _id: chat._id, user1: chat.user1, user2: chat.user2 } } }
        }
        catch (error) {
            console.log(error)
        }
    },
    rejectMatch: async (payload) => {
        try {
            payload._id = MODELS.ObjectId(payload._id)
            await MODELS.matching.findOneAndDelete(payload)
            return { status: CODES.OK, message: MESSAGES.MATCH_REJECTED_SUCCESSFULLY, data: {} }
        }
        catch (error) {
            console.log(error)
        }
    },
    deleteMatch: async (payload) => {
        try {
            payload.unMatched = MODELS.ObjectId(payload.unMatched)
            payload.chatId = MODELS.ObjectId(payload.chatId)
            let unMatchedByAnotherUser = await MODELS.unMatchedUsers.findOne({ unMatchedBy: payload.unMatched, unMatched: payload.unMatchedBy, chatId: payload.chatId }).lean();
            if (unMatchedByAnotherUser) {
                await MODELS.matching.findOneAndDelete({
                    userId: payload.unMatched,
                    matchedUserId: payload.unMatchedBy
                })
                await MODELS.matching.findOneAndDelete({
                    userId: payload.unMatchedBy,
                    matchedUserId: payload.unMatched
                })
            }
            await MODELS.unMatchedUsers.findOneAndUpdate(payload, payload, { upsert: true })
            return { status: CODES.OK, message: MESSAGES.MATCH_DELETED_SUCCESSFULLY, data: {} }
        }
        catch (error) {
            console.log(error)
        }
    },
    sendMessage: async (payload) => {
        try {
            let setObj = { ...payload.data }
            setObj.sender = MODELS.ObjectId(payload.sender)
            setObj.reciever = MODELS.ObjectId(setObj.userId)
            delete setObj['userId']
            let isUnMatched = await MODELS.unMatchedUsers.findOne({
                unMatched: setObj.sender,
                unMatchedBy: setObj.reciever,
                chatId: setObj.chatId
            }).lean()
            if(isUnMatched) return { status: CODES.BAD_REQUEST, message: MESSAGES.UNMATCHED_BY_USER, data: {isUnMatched:true} }
            let message = await MODELS.message(setObj).save()
            message = await MODELS.message.aggregate([
                {
                    $match: { _id: message._id }
                },
                {
                    $lookup: {
                        localField: "sender",
                        foreignField: "_id",
                        from: "users",
                        as: "sender"
                    }
                },
                {
                    $unwind: "$sender"
                },
                {
                    $lookup: {
                        localField: "reciever",
                        foreignField: "_id",
                        from: "users",
                        as: "reciever"
                    }
                },
                {
                    $unwind: "$reciever"
                },
                {
                    $project: PROJECTIONS.sendMessage
                }
            ])
            return { status: CODES.OK, message: MESSAGES.MESSAGE_SENT_SUCCESSFULLY, data: { ...message[0], isUnMatched: false } }
        }
        catch (error) {
            console.log(error)
        }
    },
    sendMessagePushNotification: async (payload) => {
        try {
            let user = await MODELS.user.findOne({ _id: MODELS.ObjectId(payload.data.reciever._id) }).lean().exec();
            Notifications.pushNotification(user.deviceType,
                user.deviceToken,
                `${payload.data.sender.firstName} ${payload.data.sender.lastName} sent you message`,
                `${payload.data.sender.firstName} ${payload.data.sender.lastName} sent you message`,
                payload)
            return;
        }
        catch (error) {
            console.log(error)
            return;
        }
    },
    createMessage: async (payload) => {
        try {
            payload.chatId = MODELS.ObjectId(payload.chatId)
            let isMessageExist = await MODELS.message.findOne(payload).lean().exec();
            if (isMessageExist) return false;
            let message = await MODELS.message(payload).save()
            message = await MODELS.message.aggregate([
                {
                    $match: { _id: message._id }
                },
                {
                    $lookup: {
                        localField: "sender",
                        foreignField: "_id",
                        from: "users",
                        as: "sender"
                    }
                },
                {
                    $unwind: "$sender"
                },
                {
                    $project: PROJECTIONS.createMessage
                }
            ])
            return { status: CODES.OK, message: MESSAGES.MESSAGE_RECIEVED_SUCCESSFULLY, data: { message } }
        }
        catch (error) {
            console.log(error)
        }
    },
    messageRead: async (payload) => {
        try {
            let message = await MODELS.message.findByIdAndUpdate(MODELS.ObjectId(payload.messageId), { isReaded: true }).lean()
            return { status: CODES.OK, message: MESSAGES.MESSAGE_READ_SUCCESSFULLY, data: { chatId: message.chatId, messageId: message._id, sender: message.sender } }
        }
        catch (error) {
            console.log(error)
        }
    },
    blockUser: async (payload) => {
        try {
            payload.blocked = MODELS.ObjectId(payload.blocked)
            let isExist = await MODELS.blockedUser.findOne(payload)
            if (isExist) return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_ALREADY_BLOCKED, data: {} }
            await MODELS.blockedUser(payload).save()
            return { status: CODES.OK, message: MESSAGES.USER_BLOCKED_SUCCESSFULLY, data: payload }
        }
        catch (error) {
            console.log(error)
        }
    },
    unBlockUser: async (payload) => {
        try {
            payload.blocked = MODELS.ObjectId(payload.blocked)
            let isExist = await MODELS.blockedUser.findOne(payload)
            if (isExist) {
                await MODELS.blockedUser.findOneAndDelete(payload)
                return { status: CODES.OK, message: MESSAGES.USER_UN_BLOCKED_SUCCESSFULLY, data: { unBlocked: payload.blocked, unBlockedBy: payload.blockedBy } }
            }
            return { status: CODES.BAD_REQUEST, message: MESSAGES.USER_NOT_BLOCKED, data: {} }
        }
        catch (error) {
            console.log(error)
        }
    },
    deleteChat: async (payload) => {
        try {
            await MODELS.deleteChats.findOneAndUpdate({ userId: MODELS.ObjectId(payload.userId), chatId: MODELS.ObjectId(payload.chatId) },
                { userId: MODELS.ObjectId(payload.userId), chatId: MODELS.ObjectId(payload.chatId) },
                { upsert: true }).lean().exec()
            return { status: CODES.BAD_REQUEST, message: MESSAGES.CHAT_DELETED_SUCCESSFULLY, data: {} }
        }
        catch (error) {
            console.log(error)
        }
    },
}