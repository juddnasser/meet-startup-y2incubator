import { Client, Account, Databases, TablesDB } from 'appwrite';

const apiKey = process.env.DB_APIKEY;

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

const client = new Client()
    .setProject(projectId)
    .setEndpoint('https://fra.cloud.appwrite.io/v1');

const account = new Account(client);
const tablesDB = new TablesDB(client);

export { account, client, tablesDB };