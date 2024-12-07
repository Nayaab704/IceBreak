const videoService = require('../services/videoService');

async function createVideo(req, res) {
    const { videoUrl, userId } = req.body;
    console.log(videoUrl, userId)
    try {
      const video = await videoService.createVideo(videoUrl, userId);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createVideo
}
