import { Account, Client, Databases, Storage } from "react-native-appwrite";

export const client = new Client()
                .setProject(process?.env?.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")
                .setEndpoint(process?.env?.EXPO_PUBLIC_APPWRITE_ENDPOINT || "")
                .setPlatform(process?.env?.EXPO_PUBLIC_APPWRITE_PROJECT_NAME || "")

export const account = new Account(client); 
export const database = new Databases(client);
export const storage = new Storage(client);

export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DB!;
export const DB_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_HABIT_TABLE!;
export const DB_COMPLETION_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_COMPLETION_TABLE!;
export const BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!;

export interface RealtimeResponse {
  events: string[];
  payload: any;
}