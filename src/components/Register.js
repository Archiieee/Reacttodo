import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';

const Register = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const apiUrl = 'http://localhost:5000'; 

  const register = async () => {
    try {
      console.log("Sending registration request with data:", { username, password });
      const res = await axios.post(`${apiUrl}/register`, {
        username: username,
        password: password,
      });
      swal({
        text: res.data.title,
        icon: "success"
      });
      props.history.push('/');
    } catch (err) {
      console.error("Error registering user:", err);
      swal({
        text: err.response.data.errorMessage,
        icon: "error"
      });
    }
  };
  
  


  return (
    <div style={{ marginTop: '200px' }}>
      <div>
        <h2>Register</h2>
      </div>

      <div>
        <input
          type="text"
          autoComplete="off"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="User Name"
          required
        />
        <br /><br />
        <input
          type="password"
          autoComplete="off"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br /><br />
        <input
          type="password"
          autoComplete="off"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <br /><br />
        <button
          className="button_style"
          disabled={username === '' || password === '' || confirmPassword === '' || password !== confirmPassword}
          onClick={register}
        >
          Register
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
