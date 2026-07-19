const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env file with explicit path
const envPath = path.resolve(__dirname, "..", ".env");
console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

const connectDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env");
        }

        console.log("Attempting MongoDB connection...");

        const con = await mongoose.connect(uri);

        console.log(`✅ MongoDB Connected: ${con.connection.host}`);
    } catch (err) {
        console.error("❌ MongoDB Connection Failed");
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDatabase;