import mongoose from "mongoose";
import process from "node:process";
const connectionString = "mongodb://mongodb:27017/game";
export default async function connectDB() {
    try {
        const conn = await mongoose.connect(connectionString);
        console.log(`Database connected: ${conn.connection.name}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    return;
}
