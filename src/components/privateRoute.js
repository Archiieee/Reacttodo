import React from 'react';
import { Route, useHistory } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const history = useHistory();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    history.replace("/");
    return null;
  }

  // If the user is authenticated, render the children
  return children;
};

export default PrivateRoute;
