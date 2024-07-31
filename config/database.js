/*
 * @Author: AJ Javadi 
 * @Email: amirjavadi25@gmail.com
 * @Date: 2024-07-31 16:28:56 
 * @Last Modified by: AJ Javadi
 * @Last Modified time: 2024-07-31 16:37:07
 * @Description: file:///Users/aj/Desktop/bootcamp/FREECODECAMP/Curriculum/5.%20Backend%20APIs/4.%20Projects/4.%20Exercise%20Tracker/fcc-exercise-tracker2/config/database.js
 * config for mongoose DB 
 *  can change to use Cloud Atlas Free Cluster if you want
 */


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exercise-tracker');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
