import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import API_ENDPOINTS from "../../config/apiConfig";
// import { useNavigate } from 'react-router-dom';

function RegisterForm({ triggerLogin }) {
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is not valid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (validateForm()) {
          try {
            console.log('Form Submitted', formData);
            const formDataJson = JSON.stringify(formData);
            const response = await fetch(API_ENDPOINTS.REGISTER, {
              method: "POST",
              headers: {
                "Content-Type": "application/json", 
              },
              body: formDataJson
            })
            const data = await response.json();

            if (!response.ok) {
              // Server returned an error, show it
              setServerError(data.error || "Registration failed");
              return;
            }

            console.log("Registration successful:", data);
            triggerLogin();

          } catch (error) {
            console.error("Error:", error);
            setServerError("Something went wrong. Please try again.");
          }
        }
            // .then((res) => {
            //   if (!res.ok) {
            //     throw new Error(`HTTP error! Status: ${res.status}`);
            //   }
            //   return res.json();
            //   // console.log(res.json());
            // })
            // .then((data)=>{
            //   console.log(data);
            //   // navigate("/LogIn");
            //   triggerLogin();
            // })
            // .catch((error) => {
            //   console.error("Error:", error);
            // })
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                maxWidth: 400, 
                margin: 'auto', 
                p: 3, 
                border: '1px solid #ddd', 
                borderRadius: 2 
            }}
        >
            <Typography variant="h4" gutterBottom>Sign Up</Typography>
            {serverError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {serverError}
              </Typography>
            )}
            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                fullWidth
                required
            />

            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                fullWidth
                required
            />

            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                fullWidth
                required
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                fullWidth
            >
                Sign Up
            </Button>
        </Box>
    );
}

export default RegisterForm;
