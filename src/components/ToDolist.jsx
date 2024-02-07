import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const ToDoList = ({ fetchTasks }) => {
  const [task, setTask] = useState('');

  const addTask = async () => {
    try {
      await axios.post('http://localhost:5000/tasks', { task });
      fetchTasks(); // Call fetchTasks from props
      setTask('');
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
        <Button onClick={addTask}>Add</Button>
        <br />
      </div>
    </div>
  );
};

export default ToDoList;
