import mongoose from "mongoose";
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

let isConnected = false;

export async function connectDB(){
    if(isConnected || mongoose.connection.readyState >=1){
        console.log('Already Connected to Mongo DB - Reusing Connection')
    return    
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected=true;
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.error("MongoDB Connection Failed! - ",error)
        throw error;
    }
}