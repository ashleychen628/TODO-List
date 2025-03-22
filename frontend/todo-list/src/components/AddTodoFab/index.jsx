import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddTodoFab = ({ onClick }) => {
  return (
    <Fab
      color="primary"
      aria-label="add todo"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <AddIcon />
    </Fab>
  );
};

export default AddTodoFab; 