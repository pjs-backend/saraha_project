
import mongoose from "mongoose";

 const dbConnection = async () => {
    try {

await mongoose.connect('mongodb://127.0.0.1:27017/sarahaha_app');
        console.log('Database connected successfully')
    }
    catch (error) {
        console.log('Database failing to connect',error)
    }

}
export default dbConnection