import { io } from "socket.io-client";
import { LOCAL_API_URL } from "@env";

const socket = io(LOCAL_API_URL, {
    autoConnect: false
})

// socket.on('newMessage', (data) => {
//     console.log("New message received: ", data)
// })

export const joinGroup = async (userId) => {
    await socket.emit('joinGroup', userId)
}

export const leaveGroup = async () => {
    await socket.emit('leaveGroup')
}

export const disconnectSocket = async () => {
    await socket.disconnect()
}

export default socket