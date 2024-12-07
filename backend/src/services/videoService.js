const prisma = require('../prismaClient');

async function createVideo(videoUrl, userId) {
    console.log(videoUrl, userId)
    const newVideo = await prisma.video.create({
        data :{
            url: videoUrl,
            userId
        }
    })
    return newVideo
}

module.exports = {
    createVideo
}