import mongoose from "mongoose";
import process from "node:process";
const connectionString = "mongodb://mongodb:27017/game";
export default async function connectDB() {
    try {
        const conn = await mongoose.connect(connectionString);
        console.log(`Database connected: ${conn.connection.name}`);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error(err);
        }
        process.exit(1);
    }
    return;
}
