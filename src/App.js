import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import ToDoList from './components/ToDolist';
import TaskDetails from './components/TaskDetails';

function App() {
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <ToDoList fetchTasks={fetchTasks} />
          </Route>
          <Route path="/task/:taskId">
            <TaskDetails fetchTasks={fetchTasks} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
