import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Checkbox,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API_ENDPOINTS from "../../config/apiConfig";
import { useAuth } from '../AuthProvider'; 

const ToDo = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');

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
      if (tasks.length > 0) {
        console.log("First task structure:", tasks[0]);
      }
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      console.error('Full error:', error);
    }
  };

  const handleCheckTodo = async (taskId, currentCompleted) => {
    try {
      console.log("Updating task:", { taskId, currentCompleted });
      console.log("Current tasks state:", tasks);
      
      if (!taskId) {
        console.error("TaskId is undefined. Task data:", { taskId, currentCompleted });
        return;
      }

      const response = await fetch(API_ENDPOINTS.UPDATE_TASK(taskId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ completed: !currentCompleted }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      console.log("Updated task response:", updatedTask);
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTodo = async (taskId) => {
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_TASK(taskId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingTask(null);
    setEditTitle('');
  };

  const handleEditSubmit = async () => {
    if (!editingTask || !editTitle.trim()) return;

    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_TASK(editingTask._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === editingTask._id ? updatedTask : task
        )
      );
      handleEditClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  useEffect(() => {
    console.log("Component mounted, calling getTodos");
    getTodos();

    // Listen for new todos
    const handleNewTodo = (event) => {
      const newTodo = event.detail;
      console.log("New todo received:", newTodo);
      setTasks(prevTasks => [...prevTasks, newTodo]);
    };

    window.addEventListener('todoAdded', handleNewTodo);

    return () => {
      window.removeEventListener('todoAdded', handleNewTodo);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Today's Todo List
      </Typography>
      <List>
        {tasks.length === 0 ? (
          <ListItem>
            <ListItemText primary="No tasks found" />
          </ListItem>
        ) : (
          tasks.map((task) => {
            console.log("Rendering task:", task);
            return (
              <ListItem 
                key={task._id} 
                divider
                secondaryAction={
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="edit"
                      onClick={() => handleEditClick(task)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteTodo(task._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    onChange={() => handleCheckTodo(task._id, task.completed)}
                    tabIndex={0}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={task.title}
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : 'text.primary'
                  }}
                />
              </ListItem>
            );
          })
        )}
      </List>

      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleEditSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ToDo;