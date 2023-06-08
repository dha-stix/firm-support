import { Client, Account, Databases, Storage } from "appwrite";
export const client = new Client();

client
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

export const account = new Account(client);

export const db = new Databases(client);

export const storage = new Storage(client);
