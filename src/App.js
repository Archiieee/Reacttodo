import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import ToDoList from './components/ToDolist'; // Import ToDoList component
import TaskDetails from './components/TaskDetails'; // Import TaskDetails component

function App() {
  // Define the fetchTasks function
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return []; // Return an empty array if there's an error
    }
  };

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            {/* Render ToDoList component and pass fetchTasks function as prop */}
            <ToDoList fetchTasks={fetchTasks} />
          </Route>
          <Route path="/task/:taskId">
            {/* Render TaskDetails component */}
            <TaskDetails fetchTasks={fetchTasks} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
