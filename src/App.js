import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToDoList from './components/ToDolist';
import ListCom from './components/ListCom';




function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${index}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <ToDoList fetchTasks={fetchTasks} />
      {tasks.map((task, index) => (
        <ListCom key={index} text={task} index={index} fetchTasks={fetchTasks} deleteTask={deleteTask} />
      ))}
    </div>
  );
}

export default App;
