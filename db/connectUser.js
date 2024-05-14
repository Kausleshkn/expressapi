import mongoose from "mongoose";

let errorMessage = null;

const connectDB = async (url) => {
    try {
        const options = {
            dbName: process.env.DBNAME,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(url, options);
        console.log('Database Connected....');
    } catch (error) {
        console.error('Failed to connect to database:');
        errorMessage = "Database not connected, Please check your network connection and try again.";
    }
};

const getErrorMessage = () => errorMessage;



export default connectDB;
export { getErrorMessage };
