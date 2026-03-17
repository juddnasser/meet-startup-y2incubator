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