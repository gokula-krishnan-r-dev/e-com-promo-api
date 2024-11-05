import { ConnectOptions, MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const connectDB = async (): Promise<typeof mongoose | void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
    } as ConnectOptions);
    console.log('MongoDB Connected');
    return connection; // Return the connection if needed
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure if connection fails
  }
};

export default connectDB;
