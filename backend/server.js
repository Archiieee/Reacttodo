const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/task'); // Make sure the path to your Task model is correct

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas database
const MONGODB_URI = "mongodb+srv://grp11majorproject:O38gMQD141ndO2zi@cluster0.2ppfaax.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas database');
}).catch((error) => {
  console.error('MongoDB Atlas connection error:', error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Atlas connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas database');
});
// Route to fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Route to fetch tasks by category
app.get('/tasks/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const tasks = await Task.find({ category });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to fetch all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Task.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new task
app.post('/tasks', async (req, res) => {
  const task = new Task({
    name: req.body.name,
    category: req.body.category,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Route to update a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

