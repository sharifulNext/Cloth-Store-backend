import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("DB Connected successfully");
    });


    mongoose.connection.on("error", (err) => {
        console.error("DB Connection Error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME
    });
}

export default connectDB;