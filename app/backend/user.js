import { account, client, tablesDB } from './appwrite.js';

const apiKey = process.env.DB_APIKEY;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

import { Client, Account, ID } from "appwrite";

async function SetupUserInDB(user) {

    try {
        const user = await account.create({
            userId: 'unique()',
            email: user.email,
            password: user.password
        });
        console.log(user)
    } catch (e) {
        console.error(e)
        return false;
    }

    const promise = tablesDB.createRow({
        databaseId: 'main',
        tableId: 'user',
        rowId: ID.unique(),
        data: {
            age: user.age ?? null,
            description: user.description ?? "",
            role: user.role ?? "",
            name: user.name ?? "",
            pfp: user.pfp ?? 0
        }
    });

    promise.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
        return false;
    });
    return true;
}

async function enterSession(user) {

    const account = new Account(client);

    const result = await account.createEmailPasswordSession({
        email: user.email,
        password: user.password
    });

    console.log(result);

}

async function verifyEmail(userID) {

    const promise = account.createEmailVerification({
        url: '' //TODO: add url to redirect to after verification
    });

    promise.then(function (response) {
        console.log(response); // Success
        return true;
    }, function (error) {
        console.log(error); // Failure
        return false;
    });
}


async function editUserInDB(user) {

    const promise = tablesDB.updateRow({
        databaseId: 'main',
        tableId: 'user',
        rowId: user.id,
        data: {
            age: user.age ?? null,
            jobdesc: user.jobdesc ?? "",
            role: user.role ?? "",
            name: user.name ?? "",
            pfp: user.pfp ?? 0
        }
    });

    promise.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
        return false;
    });
    return true;
}


// Login still missing, Verification email missing, password reset missing - integrate with front-end during meeting tmrw

async function resetPassword(userID, newPassword) {

}

async function deleteUserFromDB(userID) {

    const promise = tablesDB.deleteRow({
        databaseId: 'main',
        tableId: 'user',
        rowId: userID
    });
    promise.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
        return false;
    });
    return true;
}

export { SetupUserInDB, editUserInDB };

// Match users using age and gender & job description and role

// P2P Chats and Group P2P CHATS