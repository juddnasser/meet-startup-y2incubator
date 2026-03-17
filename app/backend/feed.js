import { account, tablesDB } from './appwrite.js';

const apiKey = process.env.DB_APIKEY;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

import { Client, Account, ID } from "appwrite";

async function createPost(post, userId) {

    const promise = tablesDB.createRow({
        databaseId: 'main',
        tableId: 'posts',
        rowId: ID.unique(),
        data: {
            title: post.title,
            content: post.content,
            authorId: userId
        }
    });
    promise.then(function (response) {
        console.log(response);
    }
        , function (error) {
            console.log(error);
            return false;
        });
    return true;
}

async function deletePost(postID, userID) {

    const promise = tablesDB.deleteRow({
        databaseId: 'main',
        tableId: 'posts',
        rowId: postID
    });
    promise.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
        return false;
    });
    return true;
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



    let parsedData = allUsersData.then(function (users) {
        users.forEach(user => {
            compatabilities[user.$id] = getCompatability(userId, user.rows[0].data.$id);
        });
    });

}

export { createPost, deletePost, getCompatability, getMostCompatableUsers };