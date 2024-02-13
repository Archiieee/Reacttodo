import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const ToDoList = ({ fetchTasks }) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [tasks, setTasks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editedTask, setEditedTask] = useState({ name: '', category: '' });

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
      const response = await axios.get(`http://localhost:5000/tasks/category/${selectedCategory}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
    }
  };
  

  const addTask = async () => {
    try {
      if (!allCategories.includes(category)) {
        await axios.post('http://localhost:5000/categories', { category });
        await fetchCategories();
      }
      await axios.post('http://localhost:5000/tasks', { name: task, category });
      await fetchTasks();
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
      await fetchTasks();
      setEditTask(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleCategoryChange = async (selectedCategory) => {
    try {
      if (selectedCategory === '') {
        await fetchTasks();
      } else {
        await fetchTasksByCategory(selectedCategory);
      }
      setCategory(selectedCategory);
    } catch (error) {
      console.error('Error handling category change:', error);
    }
  };
  

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
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
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <Button onClick={addTask}>Add</Button>
        <br />
        {tasks.map((task) => (
          <div key={task._id}>
            <p>{task.name}</p>
            <Link to={{ pathname: `/task/${task._id}`, state: { task } }}><Button>View Details</Button></Link>
            <Button onClick={() => handleEdit(task)}>Edit</Button>
          </div>
        ))}
        {editTask && (
          <div>
            <TextField
              type="text"
              placeholder="Edit Task"
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
            />
            <TextField
              type="text"
              placeholder="Edit Category"
              value={editedTask.category}
              onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
            />
            <Button onClick={handleSaveEdit}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;