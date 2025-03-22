import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from "../../config/apiConfig";
import { useAuth } from '../AuthProvider'; 

export default function LogIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorLogIn, setErrorLogIn] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const doLogin = async (email, password) => {
        try {
            console.log(API_ENDPOINTS.LOGIN)
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const data = await response.json();
            const token = data.token;
            const userName = data.name; 
            auth.login(token, userName); 

            navigate('/'); 

            // Reset form state
            setEmail('');
            setPassword('');
            setErrorLogIn(false);

            // Close the dialog
            props.handleClose();
        } catch (error) {
            setErrorLogIn(true);
            console.error('Login failed:', error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        doLogin(email, password);
    };

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setErrorLogIn(false);
        props.handleClose();
    };

    return (
        <Dialog open={props.open} onClose={handleClose} fullWidth>
            <DialogTitle>Log into your account</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Email</InputLabel>
                    <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errorLogIn}
                        type="email"
                        required
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Password</InputLabel>
                    <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errorLogIn}
                        type={showPassword ? 'text' : 'password'}
                        required
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                {errorLogIn && (
                    <p style={{ color: 'red' }}>
                        Invalid email or password. Please try again.
                    </p>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="outlined" autoFocus>
                    Log In
                </Button>
            </DialogActions>
            <DialogActions>
                <Button href="/register">Sign Up Now!</Button>
            </DialogActions>
        </Dialog>
    );
}
