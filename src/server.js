const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

let tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { task } = req.body;
  tasks.push(task);
  res.status(201).send('Task added successfully');
});

app.put('/tasks/:index', (req, res) => {
  const { index } = req.params;
  const { task } = req.body;
  tasks[index] = task;
  res.send('Task updated successfully');
});

app.delete('/tasks/:index', (req, res) => {
  const { index } = req.params;
  tasks.splice(index, 1);
  res.send('Task deleted successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
