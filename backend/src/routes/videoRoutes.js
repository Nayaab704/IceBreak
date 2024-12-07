const express = require('express');
const videoController = require('../controllers/videoController')
const router = express.Router();


router.post('/createVideo', videoController.createVideo)

module.exports = router;