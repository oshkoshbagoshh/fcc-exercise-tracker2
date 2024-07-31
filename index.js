import express from 'express';
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
// Remove the line since 'bodyparser' is not used
const User = require('./models/User');
const Exercise = require('./models/Exercise');

app.use(cors())
app.use(express.static('public'))
app.get('/', (_, res) => {
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
app.post('/api/users', async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
});


// Add exercises 
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const userId = req.params._id;
    const { description, duration, date } = req.body;

    const user = await User.findById(userId);
    // if user doesn't exist
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const newExercise = new Exercise({
      userId,
      description,
      duration,
      date: date ? new Date(date) : new Date(),
    });

    const savedExercise = await newExercise.save();
    res.json({
      _id: user._id,
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get user's exercise log
app.get('/api/users/:_id,/logs', async (req, res) => {
  try {
    const userId = req.params._id;
    const { from, to, limit } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    //  date filter and queries
    let dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const exercises = await Exercise.find({
      userId,
      date: dateFilter,
    })
      .limit(parseInt(limit))
      .exec();

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises.map((ex) => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString(),

      })),
    });


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
);



//  ------------------
//  LISTEN
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
