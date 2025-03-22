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
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API_ENDPOINTS from "../../config/apiConfig";
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const ToDo = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);

  const handleSessionExpired = () => {
    setTasks([]);
    setSessionExpiredOpen(true);
    auth.logout();
  };

  const handleSessionExpiredClose = () => {
    setSessionExpiredOpen(false);
    navigate('/');
  };

  const checkAuthAndProceed = async (apiCall) => {
    try {
      if (!auth.token) {
        handleSessionExpired();
        return null;
      }
      const result = await apiCall();
      return result;
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        handleSessionExpired();
      }
      return null;
    }
  };

  const getTodos = async () => {
    await checkAuthAndProceed(async () => {
      const response = await fetch(API_ENDPOINTS.GET_TASKS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('401');
        }
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const tasks = await response.json();
      setTasks(tasks);
    });
  };

  const handleCheckTodo = async (taskId, currentCompleted) => {
    if (!taskId) return;

    await checkAuthAndProceed(async () => {
      const response = await fetch(API_ENDPOINTS.UPDATE_TASK(taskId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ completed: !currentCompleted }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('401');
        }
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? updatedTask : task
        )
      );
    });
  };

  const handleDeleteTodo = async (taskId) => {
    await checkAuthAndProceed(async () => {
      const response = await fetch(API_ENDPOINTS.DELETE_TASK(taskId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('401');
        }
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    });
  };

  const handleEditSubmit = async () => {
    if (!editingTask || !editTitle.trim()) return;

    await checkAuthAndProceed(async () => {
      const response = await fetch(API_ENDPOINTS.UPDATE_TASK(editingTask._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('401');
        }
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === editingTask._id ? updatedTask : task
        )
      );
      handleEditClose();
    });
  };

  useEffect(() => {
    if (!auth.token) {
      handleSessionExpired();
      return;
    }
    getTodos();

    const handleNewTodo = (event) => {
      const newTodo = event.detail;
      setTasks(prevTasks => [...prevTasks, newTodo]);
    };

    window.addEventListener('todoAdded', handleNewTodo);

    return () => {
      window.removeEventListener('todoAdded', handleNewTodo);
    };
  }, [auth.token]);

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
          tasks.map((task) => (
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
          ))
        )}
      </List>

      {/* Edit Dialog */}
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

      {/* Session Expired Dialog */}
      <Dialog
        open={sessionExpiredOpen}
        onClose={handleSessionExpiredClose}
        aria-labelledby="session-expired-dialog-title"
        aria-describedby="session-expired-dialog-description"
      >
        <DialogTitle id="session-expired-dialog-title">
          Session Expired
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="session-expired-dialog-description">
            Your session has expired. Please log in again to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSessionExpiredClose} color="primary" variant="contained">
            Log In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ToDo;