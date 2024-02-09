import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const ToDoList = ({ fetchTasks }) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [tasks, setTasks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editedTask, setEditedTask] = useState({ name: '', category: '' }); // Define editedTask

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setAllCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTasksByCategory = async (selectedCategory) => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${selectedCategory}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
    }
  };

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

  const handleEdit = (task) => {
    setEditTask(task);
    setEditedTask({ name: task.name, category: task.category });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${editTask._id}`, editedTask);
      fetchTasks();
      setTask('');
      setCategory('');
      setEditTask(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    if (selectedCategory === '') {
      fetchTasks();
    } else {
      fetchTasksByCategory(selectedCategory);
    }
    setCategory(selectedCategory);
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
        <select value={category} onChange={(e) => { setCategory(e.target.value); handleCategoryChange(e.target.value); }}>
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <Button onClick={addTask}>Add</Button>
        <br />
        {tasks.map(task => (
          <div key={task._id}>
            <p>{task.name}</p>
            <Button onClick={() => handleEdit(task)}>Edit</Button>
          </div>
        ))}
        {editTask && (
          <div>
            <TextField
              type="text"
              placeholder="Edit Task"
              value={editedTask.name} // Use editedTask.name instead of task
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })} // Update editedTask
            />
            <TextField
              type="text"
              placeholder="Edit Category"
              value={editedTask.category} // Use editedTask.category instead of category
              onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })} // Update editedTask
            />
            <Button onClick={handleSaveEdit}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
