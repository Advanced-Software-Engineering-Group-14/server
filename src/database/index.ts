/* eslint-disable */
import mongoose from 'mongoose';
import { VoidFunction } from '../types';

// Fix deprecation warning
mongoose.set('strictQuery', false);

const MONGO_URI = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.MONGO_URI_PRO;
  } else if (process.env.NODE_ENV === 'test') {
    return process.env.MONGO_URI_TEST;
  } else {
    return process.env.MONGO_URI_DEV;
  }
};

const DBCONNECT = async (callback: VoidFunction) => {
  const URI = MONGO_URI() as string;
  // console.log(process.env.NODE_ENV);
    
  try {
    mongoose.connect(URI, { autoIndex: true });

    // check if database is connected
    console.log(`🚀 Database connected in ${(process.env.NODE_ENV)?.toUpperCase()} mode`);

    // check if database is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('⛔ Database is disconnected');
    });

    // Callback function
    callback();
  } catch (error) {
    console.log(error);
    throw new Error('There was an error connecting to the database');
  }
};

export default DBCONNECT;
