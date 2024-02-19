import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ToDoList from './components/ToDolist';
import TaskDetails from './components/TaskDetails';
import Login from './Login';
import Register from './Register';
import axios from 'axios';

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
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/todolist" render={() => <ToDoList fetchTasks={fetchTasks} />} />
          <Route path="/task/:taskId" render={() => <TaskDetails fetchTasks={fetchTasks} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
