
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ToDoList from './components/ToDolist';
import TaskDetails from './components/TaskDetails';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/privateRoute.js';

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/todolist" element={<PrivateRoute><ToDoList/></PrivateRoute>} >
            {isAuthenticated ? <ToDoList /> : <Redirect to="/login" />}
          </Route>
          <Route path="/task/:taskId" component={TaskDetails} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
