import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    global.isMongoConnected = true;
    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    logger.warn('Running in fallback mode - some features will be limited');
    global.isMongoConnected = false;
    // Don't exit, allow the server to continue in fallback mode
  }
};

export default connectDB;
