/*
 * @Author: AJ Javadi 
 * @Email: amirjavadi25@gmail.com
 * @Date: 2024-07-31 16:33:41 
 * @Last Modified by: AJ Javadi
 * @Last Modified time: 2024-07-31 16:41:48
 * @Description: file:///Users/aj/Desktop/bootcamp/FREECODECAMP/Curriculum/5.%20Backend%20APIs/4.%20Projects/4.%20Exercise%20Tracker/fcc-exercise-tracker2/index.js
 * main entry into the application 
 * 
 */


const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


const cors = require('cors');
const app = express();

// database config
const connectDB = require('./config/database');

// Routes
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');

// Connect to MongoDB
connectDB();

// more config....
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the home page

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/views/index.html')
});




// Routes
app.use('/api', userRoutes);
app.use('/api', exerciseRoutes);


//  ------------------
//  LISTEN
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
