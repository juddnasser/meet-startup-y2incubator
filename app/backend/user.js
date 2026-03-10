import { account, tablesDB } from './appwrite.js';

const apiKey = process.env.local.DB_APIKEY;
const projectId = process.env.local.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

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


// Login still missing, Verification email missing, password reset missing, delete user missing

export { SetupUserInDB, editUserInDB };