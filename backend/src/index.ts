import axios from "axios";
import app from "./app";
import mongoose from "mongoose";
import { startCleanupJob } from "./utils/cleanupafter30days.util";
declare global {
    namespace Express {
        interface Request {
            token?: any;
        }
    }
}

const start = async() =>{
    // Set Mongoose connection
    try {
        await mongoose.connect(process.env.DATABASE_URL!,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            numberOfRetries: 5,
        });
        console.log("Connected to MongoDB");
        startCleanupJob();

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

start().then(()=>{
   app.listen(3000, () => {
       console.log("Server is running on port 3000");
   });
})