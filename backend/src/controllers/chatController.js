const chatService = require('../services/chatService');


async function search_users(req, res) {
    const searchUsername = req.body.username;
    const cursor = req.body.cursor
    const currentUser = req.body.currentUser
    try {
        const users = await chatService.search_users(searchUsername, currentUser, cursor);
        res.status(201).json(users);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ error: error.message });
    }
}

async function create_group(req, res) {
    const {users, name} = req.body
    try {
        const newGroup = await chatService.create_group(users, name)
        // emitNewGroup(users)
        res.status(201).json(newGroup);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ error: error.message });
    }
}

async function get_user_groups(req, res) {
    const {userId} = req.body
    try {
        const group = await chatService.get_user_groups(userId)
        res.status(201).json(group);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ error: error.message });
    }
}

async function create_message(req, res) {
    const {content, url, mediaType, senderId, groupId} = req.body
    console.log(content, url, mediaType, senderId, groupId)
    const actualMediaType = mediaType ? mediaType : "TEXT"
    try {
        const message = await chatService.create_message(content, url, actualMediaType, senderId, groupId)
        res.status(201).json(message);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ error: error.message });
    }
}

async function get_messages_for_group(req, res) {
    const {groupId} = req.body
    try {
        const messages = await chatService.get_messages_for_group(groupId)
        res.status(201).json(messages);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ error: error.message });
    }
}

async function get_newest_messages_for_group(req, res) {
    const {groupId, timestamp} = req.body
    try {
        const messages = await chatService.get_newest_messages_for_group(groupId, timestamp)
        res.status(201).json(messages);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    search_users,
    create_group,
    get_user_groups,
    create_message,
    get_messages_for_group,
    get_newest_messages_for_group
}