const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes')
const chatRoutes = require('./routes/chatRoutes');
const s3Routes = require('./routes/s3Routes')
const { get_group_members } = require('./services/chatService');
const { getUserById } = require('./services/authService');
// const { io, createIo } = require("./socket")
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
  origin: "http://localhost:3000",
  // methods: ['POST']
}))
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/s3', s3Routes)

var connectedUsers = new Map()

const PORT = process.env.PORT || 5000;

console.log("PORT: ", PORT)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  watchSever()
});

async function watchSever() {
  const client = new MongoClient(process.env.DATABASE_URL)

  try {
    await client.connect()
    const db = client.db('Prisma')
    const messagesCollection = db.collection('Message')
    const groupCollection = db.collection("Group")

    // Watch the entire Message collection
    const messageStream = messagesCollection.watch()
    const groupStream = groupCollection.watch()

    messageStream.on('change', async (next) => {
      if (next.operationType === 'insert') {
        const newMessage = next.fullDocument
        console.log("New Message Detected: ", newMessage)

        const groupMembers = await get_group_members(newMessage.groupId)
        const { id, username } = await getUserById(newMessage.senderId)

        groupMembers.forEach(async (member) => {
          try {
            const userSocketIds = connectedUsers.get(member.user.id)
            if (userSocketIds === undefined) {
              return
            }
            userSocketIds.forEach((socketId) => {
              io.to(socketId).emit('newMessage', {
                groupId: newMessage.groupId,
                content: newMessage.content,
                mediaType: newMessage.mediaType,
                sender: {
                  id,
                  username
                },
                createdAt: newMessage.createdAt,
                id: newMessage._id,
                url: newMessage.url
              })
            })
          } catch (error) {
            console.log("Error getting user socketIds", error)
          }
        })
      }
    })

    groupStream.on('change', async (next) => {
      if (next.operationType === 'insert') {
        const newGroup = next.fullDocument
        console.log(newGroup)
        const groupMembers = await get_group_members(newGroup._id)
        const ids = groupMembers.map(member => member.user.id)
        emitNewGroup(ids)
      }
    })
  } catch (error) {
    console.log("Error watching messages")
  }
}

io.on('connection', (socket) => {
  console.log("A new user connected: ", socket.id)

  socket.on('joinGroup', async (userId) => {
    console.log("UserId:", userId)
    try {
      // await addSocketId(socket.id, userId)
      const socketIds = connectedUsers.get(userId)
      const newIds = socketIds === undefined ? [socket.id] : [...socketIds, socket.id]
      connectedUsers.set(userId, newIds)
      socket.userId = userId
      console.log(connectedUsers)
    } catch (error) {
      console.log("Error adding socketId: ", error.message)
    }
  })

  socket.on('leaveGroup', async () => {
    console.log("User leaving group")
    await leaveGroup(socket.id, socket.userId)
  })

  socket.on('disconnect', async () => {
    console.log('A user disconnected: ', socket.id)
    await leaveGroup(socket.id, socket.userId)
  })
})

function emitNewGroup(users) {
  users.forEach(userId => {
    const socketIds = connectedUsers.get(userId)
    if (socketIds === undefined) return
    socketIds.forEach(socketId => {
      io.to(socketId).emit('newGroup')
    })
  })
}

const leaveGroup = async (socketId, userId) => {
  try {
    const userSocketIds = connectedUsers.get(userId)
    if (userSocketIds === undefined) return
    const newSocketIds = userSocketIds.filter(thisSocketId => thisSocketId !== socketId)
    if (newSocketIds.length === 0) {
      connectedUsers.delete(userId)
    } else {
      connectedUsers.set(userId, newSocketIds)
    }
  } catch (error) {
    console.log("Error leaving group: ", error.message)
  }
}