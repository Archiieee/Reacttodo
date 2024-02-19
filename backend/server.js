const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/task');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

const User = require('./models/User');


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


app.get('/tasks/all', async (req, res) => {
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
  const { name, category, description } = req.body; 
  try {
    // Create a new task document
    const task = new Task({
      name,
      category, // Store the category name as provided by the user
      description,
    });
    
    // Save the new task to the database
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
  const { name, category, description } = req.body; 
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, category, description }, // Update 
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


//

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

app.post("/login", async (req, res) => {
  try {
    console.log("Received POST request to /login");
    console.log("Request Body:", req.body);

    if (req.body && req.body.username && req.body.password) {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        console.log("User not found");
        return res.status(400).json({
          errorMessage: 'Username or password is incorrect!',
          status: false
        });
      }

      // Compare the plaintext password with the hashed password stored in the database
      const passwordMatch = req.body.password === user.password;
      if (passwordMatch) {
        // Passwords match, generate token and send response
        console.log("Password matched. Generating token...");
        checkUserAndGenerateToken(user, req, res);
      } else {
        // Passwords do not match
        console.log("Password does not match");
        res.status(400).json({
          errorMessage: 'Username or password is incorrect!',
          status: false
        });
      }
    } else {
      console.log("Invalid parameters");
      res.status(400).json({
        errorMessage: 'Add proper parameters first!',
        status: false
      });
    }
  } catch (e) {
    console.error("Error in /login route:", e);
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* register api */
app.post("/register", async (req, res) => {
  console.log("Received POST request to /register");
  console.log("Request Body:", req.body);
  try {
    if (req.body && req.body.username && req.body.password) {
      // Check if the username already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({
          errorMessage: `Username ${req.body.username} already exists!`,
          status: false
        });
      }

      // If username is unique, create a new user
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      
      await newUser.save();
      res.status(200).json({
        status: true,
        title: 'Registered Successfully.'
      });
    } else {
      res.status(400).json({
        errorMessage: 'Invalid parameters!',
        status: false
      });
    }
  } catch (err) {
    console.error("Error in /register route:", err);
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true
      });
    }
  });
}



//


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});