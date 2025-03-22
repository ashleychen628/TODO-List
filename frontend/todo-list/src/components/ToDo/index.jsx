import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import API_ENDPOINTS from "../../config/apiConfig";
import { useAuth } from '../AuthProvider'; 

const ToDo = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState([]);

  const getTodos = async () => {
    try {
      const token = auth.token;
      console.log("Fetching tasks with token:", token ? "Token exists" : "No token");

      const response = await fetch(API_ENDPOINTS.GET_TASKS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const tasks = await response.json();
      console.log("Fetched tasks:", tasks);
      console.log("Tasks length:", tasks.length);
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      console.error('Full error:', error);
    }
  };

  useEffect(() => {
    console.log("Component mounted, calling getTodos");
    getTodos();
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Tasks
      </Typography>
      <List>
        {tasks.length === 0 ? (
          <ListItem>
            <ListItemText primary="No tasks found" />
          </ListItem>
        ) : (
          tasks.map((task) => (
            <ListItem key={task.id} divider>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={task.title} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default ToDo;