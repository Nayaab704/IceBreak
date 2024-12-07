const prisma = require('../prismaClient');

async function search_users(username, currentUser, cursor) {
    console.log("Current User: ", currentUser)
    const users = prisma.user.findMany({
        where: {
            username: {
                startsWith: username,
                mode: 'insensitive'
            },
            id: {
                not: currentUser
            }
        },
        orderBy: {
            username: 'asc'
        },
        take: 10,
        ...(cursor && {
            cursor: {
                username: cursor
            },
            skip: 1
        }),
        select: {
            id: true,
            username: true
        }
    })

    return users
}

async function create_group(users, name) {
    
    const newGroup = await prisma.group.create({
        data: {
            name,
            userGroups: {
                create: users.map(userId => ({
                    user: {
                        connect: {id: userId}
                    }
                }))
            }
        }
    })

    return newGroup
}

async function get_user_groups(userId) {
    
    const userWithGroups = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            userGroups: {
                include: {
                    group: true
                }
            }
        }
    })

    if (userWithGroups === null) {
        return []
    }

    const groups = userWithGroups.userGroups.map(userGroup => userGroup.group)

    return groups
}

async function get_group_members_minus_current_user(groupId, userId) {
    try {
        const groupMembers = await prisma.userGroup.findMany({
            where: {
                groupId,
                userId: {not: userId}
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        return groupMembers
    } catch (error) {
        console.log("Error getting group members (minus user):\n", error)
    }
    
}

async function get_group_members(groupId) {
    try {
        const groupMembers = await prisma.userGroup.findMany({
            where: {
                groupId,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        return groupMembers
    } catch (error) {
        console.log("Error getting group members:\n", error)
    }
}

async function create_message(content, url, mediaType, senderId, groupId) {
    console.log(groupId)
    const newMessage = await prisma.message.create({
        data: {
            sender: {
                connect: {id: senderId}
            },
            group: {
                connect: {id: groupId}
            },
            content: content || null,
            video: url !== undefined && mediaType === "VIDEO" ? {
                create: {
                    url
                }
            } : undefined,
            url,
            mediaType
        } 
    })

    return newMessage
}

async function get_messages_for_group(groupId) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                groupId
            },
            select: {
                id: true,
                content: true,
                url: true,
                mediaType: true,
                createdAt: true,
                sender: {
                    select: {
                        username: true,
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: 0, // Can skip messages in future
            take: 20 // Only take certain amount of messages in case group has many
        })
        return (messages)
    } catch (error) {
        console.log("Error getting messages for group:\n", error.message)
    }
}

async function get_newest_messages_for_group(groupId, timestamp) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                groupId,
                createdAt: {
                    gt: new Date(timestamp)
                }
            },
            select: {
                id: true,
                content: true,
                url: true,
                mediaType: true,
                createdAt: true,
                sender: {
                    select: {
                        username: true,
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })
        return messages
    } catch (error) {
        console.log("Error getting newest messages: ", error.message)
    }
}

module.exports = {
    search_users,
    create_group,
    get_user_groups,
    get_group_members_minus_current_user,
    get_group_members,
    create_message,
    get_messages_for_group,
    get_newest_messages_for_group
}