import { tablesDB } from './appwrite.js';
import { ID } from 'appwrite';

async function createPost(post, userId) {
    try {
        const response = await tablesDB.createRow({
            databaseId: 'main',
            tableId: 'posts',
            rowId: ID.unique(),
            data: {
                title: post.title,
                content: post.content,
                authorId: userId,
            },
        });

        console.log('Post created:', response);
        return response; // return real data
    } catch (error) {
        console.error('Create post error:', error);
        return null;
    }
}

async function deletePost(postID) {
    try {
        const response = await tablesDB.deleteRow({
            databaseId: 'main',
            tableId: 'posts',
            rowId: postID,
        });

        console.log('Post deleted:', response);
        return true;
    } catch (error) {
        console.error('Delete post error:', error);
        return false;
    }
}

async function getCompatability(user1, user2) {
    const user1Data = tablesDB.getRow({
        databaseId: 'main',
        tableId: 'users',
        rowId: user1
    });
    const user2Data = tablesDB.getRow({
        databaseId: 'main',
        tableId: 'users',
        rowId: user2
    });

    return Promise.all([user1Data, user2Data])
        .then(function (responses) {
            const user1Interests = responses[0].rows[0].data.supportTypes;
            const user2Interests = responses[1].rows[0].data.supportTypes;

            const shared = user2Interests.filter(interest =>
                user1Interests.includes(interest)
            );

            return shared.length / user1Interests.length;
        })
        .catch(function (error) {
            console.log(error);
            return 0;
        });
}

async function getMostCompatableUsers(userId) {
    const allUsersData = tablesDB.listRows({
        databaseId: 'main',
        tableId: 'users',
        queries: [
            tablesDB.queryEqual('*', '$id')
        ]
    });


    let compatabilities = {};



    let parsedData = allUsersData["documents"].then(function (users) {
        users.forEach(user => {
            compatabilities[user.$id] = getCompatability(userId, user.$id);
        });
    });

}

export { createPost, deletePost, getCompatability, getMostCompatableUsers };

