import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';


const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errorText, setErrorText] = useState({});

  const handleChange = (evt) => {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
  };

  const handleValidation = () => {
    let error = {};
    let isError = false;

    if (!username) {
      error.username = 'Username cannot be empty';
      isError = true;
    }
    if (!password) {
      error.password = 'Password cannot be empty';
      isError = true;
    }
    setErrorText(error);
    return {
      error,
      isError,
    };
  };

  const handleSubmit = async () => {
    const validate = handleValidation();
    if (!validate?.isError) {
      try {
        const payload = { username, password }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/rest/admin/auth`, { auth: payload })
        if (response?.status === 201) {
          localStorage.setItem("token", response?.data?.jwt);
          navigate("/did-list")
        }
      } catch (error) {
        console.error("Error", error);
      }
    }
  };

  const { username, password } = credentials;
  return (
    <Box
      my={4}
      display="flex"
      alignItems="center"
      justifyContent={'center'}
      gap={4}
      p={4}
      flexDirection={'column'}
      sx={{ border: '2px solid grey' }}
    >
      <Typography variant="h6" gutterBottom>Login</Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        name="username"
        onChange={handleChange}
        value={username}
        helperText={errorText?.username}
        error={errorText?.username}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        name="password"
        onChange={handleChange}
        value={password}
        helperText={errorText?.password}
        error={errorText?.password}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
