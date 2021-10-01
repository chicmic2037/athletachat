
module.exports = {
    createMessage: {
        _id: 1,
        sender: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        },
        type: 1,
        text: 1,
        uploads: 1,
        chatId: 1,
        createdAt: 1,
        isReaded: 1
    },
    sendMessage: {
        _id: 1,
        sender: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        },
        reciever: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        },
        type: 1,
        text: 1,
        uploads: 1,
        chatId: 1,
        createdAt: 1,
        isReaded: 1
    }
}