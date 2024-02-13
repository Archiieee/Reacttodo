const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/task');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const MONGODB_URI =
  'mongodb+srv://grp11majorproject:O38gMQD141ndO2zi@cluster0.2ppfaax.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas database');
  })
  .catch((error) => {
    console.error('MongoDB Atlas connection error:', error);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Atlas connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas database');
});

// Route to fetch task details by ID
app.get('/tasks/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
app.get('/tasks/category/:category', async (req, res) => {
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
  const { name, category, description } = req.body; // Include description in request body
  const task = new Task({
    name,
    category,
    description, // Save description in the database
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to add a new category
app.post('/categories', async (req, res) => {
  const { category } = req.body;
  try {
    // Check if the category already exists
    const existingCategory = await Task.findOne({ category });
    if (existingCategory) {
      res.status(400).json({ message: 'Category already exists' });
    } else {
      // Create a new category document
      const newCategory = new Task({ category });
      await newCategory.save();
      res.status(201).json(newCategory);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body; // Include description in request body
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, category, description }, // Update description along with name and category
      { new: true }
    );
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
