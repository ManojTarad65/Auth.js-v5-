import mongoose from "mongoose";

const connectToDB = async () => {

    const MONGO_URI = process.env.MONGO_URI as string;
    try {
        await mongoose.connect(MONGO_URI) ;
        console.log("Successfully connected to MongoDB 🫶🏻");
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectToDB;
