const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const User = require('./models/User');
const Exercise = require('./models/Exercise');

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// MongoDB Connection
// TODO: wrap in try catch, async await
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exercise-tracker');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a new user
app.post('/api/users', async(req, res) => {
  try {
    const newUser = new User({
      username: req.body.username
    });
    const savedUser = await newUser.save();
    res.json({
      username: savedUser.username,
      _id: savedUser._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});


// Add exercises 


// Get user's exercise log



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
