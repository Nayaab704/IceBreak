const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.post("/search_users", chatController.search_users)
router.post("/create_group", chatController.create_group)
router.post("/get_user_groups", chatController.get_user_groups)
router.post("/create_message", chatController.create_message)
router.post("/get_messages_for_group", chatController.get_messages_for_group)
router.post("/get_newest_messages_for_group", chatController.get_newest_messages_for_group)

module.exports = router