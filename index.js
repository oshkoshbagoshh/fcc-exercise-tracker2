const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

//  serve static files from public dir
app.use(express.static('public'));

// get the home page view
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});



// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Data Store Functions
async function initializeDataStore() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify({ users: [], exercises: [] }));
  }
}

async function readData() {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

async function addItem(collection, item) {
  const data = await readData();
  if (!data[collection]) {
    data[collection] = [];
  }
  item.id = Date.now().toString();
  data[collection].push(item);
  await writeData(data);
  return item;
}

async function getItems(collection) {
  const data = await readData();
  return data[collection] || [];
}

async function getItemById(collection, id) {
  const data = await readData();
  return (data[collection] || []).find((item) => item.id === id);
}

// Initialize data store
initializeDataStore()
  .then(() => console.log("Data store updated"))
  .catch(console.error);

// Routes
app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  try {
    // Check if user already exists
    const users = await getItems('users');
    const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

//  if user doesn't exist, add a new one
  
    const user = await addItem("users", { username });
    res.json({ username: user.username, _id: user.id });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await getItems("users");
    res.json(users.map((user) => ({ username: user.username, _id: user.id })));
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;

  if (!description || !duration) {
    return res
      .status(400)
      .json({ error: "Description and duration are required" });
  }

  try {
    const user = await getItemById("users", userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const exercise = {
      userId,
      description,
      duration: parseInt(duration),
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
    };

    const savedExercise = await addItem("exercises", exercise);
    res.json({
      _id: user.id,
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date,
    });
  } catch (error) {
    res.status(500).json({ error: "Error saving exercise" });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const userId = req.params._id;
  const { from, to, limit } = req.query;

  try {
    const user = await getItemById("users", userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let exercises = (await getItems("exercises")).filter(
      (ex) => ex.userId === userId
    );

    if (from) {
      exercises = exercises.filter((ex) => new Date(ex.date) >= new Date(from));
    }
    if (to) {
      exercises = exercises.filter((ex) => new Date(ex.date) <= new Date(to));
    }
    if (limit) {
      exercises = exercises.slice(0, parseInt(limit));
    }

    res.json({
      _id: user.id,
      username: user.username,
      count: exercises.length,
      log: exercises.map(({ description, duration, date }) => ({
        description,
        duration,
        date,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving exercise log" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
