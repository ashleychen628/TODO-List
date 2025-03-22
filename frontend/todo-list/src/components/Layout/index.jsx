import React, { useState } from 'react';
import { Box } from '@mui/material';
import AddTodoFab from '../AddTodoFab';
import AddTodoDialog from '../AddTodoDialog';

const Layout = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTodo = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddNewTodo = (newTodo) => {
    // This will be handled by the ToDo component through a callback
    window.dispatchEvent(new CustomEvent('todoAdded', { detail: newTodo }));
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {children}
      <AddTodoFab onClick={handleAddTodo} />
      <AddTodoDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewTodo}
      />
    </Box>
  );
};

export default Layout; 