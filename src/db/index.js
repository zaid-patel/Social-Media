import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB=async ()=>{
    try {
        const cntInstance=await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        
        )
        console.log('ds connected',cntInstance.connection.host)
        
    } catch (error) {
        console.log('db error:',error);
        process.exit(1)
    }
}

export default connectDB