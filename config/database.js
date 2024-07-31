/*
 * @Author: AJ Javadi 
 * @Email: amirjavadi25@gmail.com
 * @Date: 2024-07-31 16:28:56 
 * @Last Modified by: AJ Javadi
 * @Last Modified time: 2024-07-31 16:37:07
 * @Description: config for mongoose DB 
 *  can change to use Cloud Atlas Free Cluster if you want
 */

const mongoose = require('mongoose');

// If you're using dotenv, uncomment the next line
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
