const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

const url = process.env.MONGO_URI;

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let feedbackCollection;
let usersCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db("portfolio"); 
        feedbackCollection = db.collection("feedbacks"); 
        usersCollection = db.collection("user");

        console.log("Connected to MongoDB!");
        return { feedbackCollection, usersCollection };
    } catch (err) {
        console.error("DB Connection Error:", err);
        process.exit(1);
    }
}
module.exports = { client, connectDB };
