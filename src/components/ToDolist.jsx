import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const ToDoList = ({ fetchTasks }) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    try {
      await axios.post('http://localhost:5000/tasks', { name: task, category });
      fetchTasks(); 
      setTask('');
      setCategory('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="main_div">
      <div className="center_div">
        <br />
        <h1>TO DO LIST</h1>
        <br />
        <TextField
          type="text"
          placeholder="Add Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <TextField
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button onClick={addTask}>Add</Button>
        <br />
        {/* Render tasks */}
        {tasks.map(task => (
          <div key={task._id}>
            <p>{task.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;