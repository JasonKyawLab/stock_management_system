import { MongoClient } from "mongodb";
import { env } from "../config/env.js";

// MongoDB Client
const client = new MongoClient(env.mongoUrl);

let db;

export async function connectToMongo(){
    if (db) return db;

    try {
        await client.connect();
        db = client.db("inventory");
        console.log("✅ MongoDB connected");
        return db;
    }
    catch (err) {
        console.error("❌ MongoDB connection failed", err);
        process.exit(1);
    }
}

export function getMongoDb() {
    if (!db){
        throw new Error ("MongoDB not initialized. Call connectToMongo() first.")
    }
    return db;
}