const { group } = require("./prismaClient")

async function sendNotificationToGroupMembers(userId, message, io) {
    // console.log("Sending ", message, " to ", userId)
    io.to(userId).emit('newMessage', {
        groupId: message.groupId,
        content: message.content,
        senderId: message.senderId
    })
}

module.exports = {
    sendNotificationToGroupMembers
}