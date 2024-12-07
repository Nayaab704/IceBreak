const AWS = require('@aws-sdk/client-s3')
const AWSSigner = require('@aws-sdk/s3-request-presigner')
require('dotenv').config();

const s3Client = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: "us-east-1",
    endpoint: "https://s3.us-east-1.amazonaws.com"
})


async function videoUploadPreSignedUrl(req, res) {

    const { contentType, username } = req.body
    const videoFileName = `${username}-${Date.now()}.mp4`
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `videos/${videoFileName}`,
        ContentType: contentType
    }

    const command = new AWS.PutObjectCommand(params)

    try {
        const url = await AWSSigner.getSignedUrl(s3Client, command, { expiresIn: 60 })
        res.status(201).json({ url, videoFileName })
    } catch (error) {
        console.log("Error getting signed video URL: ", error)
        res.status(400).json({ error: error.message });
    }
}

async function photoUploadPreSignedUrl(req, res) {
    const { contentType, username } = req.body
    const photoFileName = `${username}-${Date.now()}.jpeg`
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `images/${photoFileName}`,
        ContentType: contentType
    }

    const command = new AWS.PutObjectCommand(params);
    try {
        const url = await AWSSigner.getSignedUrl(s3Client, command, { expiresIn: 60 })
        res.status(201).json({ url, photoFileName })
    } catch (error) {
        console.log("Error getting signed photo URL: ", error)
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    videoUploadPreSignedUrl,
    photoUploadPreSignedUrl
}