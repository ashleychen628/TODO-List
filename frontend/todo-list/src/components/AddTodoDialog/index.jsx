import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import API_ENDPOINTS from "../../config/apiConfig";
import { useAuth } from '../AuthProvider';

const AddTodoDialog = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const auth = useAuth();
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Focus the input field when dialog opens
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      const response = await fetch(API_ENDPOINTS.ADD_TASK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ title: title.trim(), completed: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      onAdd(newTask);
      setTitle('');
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="add-todo-dialog-title"
      aria-describedby="add-todo-dialog-description"
    >
      <DialogTitle id="add-todo-dialog-title">Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={titleInputRef}
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          id="add-todo-dialog-description"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!title.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTodoDialog; 