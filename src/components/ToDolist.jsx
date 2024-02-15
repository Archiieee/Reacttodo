import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const ToDoList = () => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [tasks, setTasks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editedTask, setEditedTask] = useState({ name: '', category: '' });
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      console.log('Fetched categories:', response.data);
      setAllCategories(response.data); // Set categories using setAllCategories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks/all');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
      // Check if each selected category already exists
      for (const selectedCategory of categories) {
        if (!allCategories.includes(selectedCategory)) {
          await axios.post('http://localhost:5000/categories', { category: selectedCategory });
          setAllCategories(prevCategories => [...prevCategories, selectedCategory]);
        }
      }
    
      await axios.post('http://localhost:5000/tasks', { name: task, category: categories[0], description });
      
      await fetchTasks();
      
      setTask('');
      setCategory('');
      setDescription('');
     
     // setAllCategories(prevCategories => [...prevCategories, ...categories]);
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
      setTasks(prevTasks => prevTasks.map(prevTask => prevTask._id === editTask._id ? { ...prevTask, ...editedTask } : prevTask));
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
      setTasks(prevTasks => prevTasks.filter(prevTask => prevTask._id !== taskId));
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
        <TextField
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          <Card key={task._id} style={{ marginBottom: '10px' }}>
            <CardContent>
              <p>{task.name}</p>
              <Link to={{ pathname: `/task/${task._id}`, state: { task } }}><Button>View Details</Button></Link>
              <Button onClick={() => handleEdit(task)}>Edit</Button>
              <Button onClick={() => deleteTask(task._id)}>Delete</Button>
            </CardContent>
          </Card>
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
