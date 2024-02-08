import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'; // Import necessary components from @mui/material
import axios from 'axios';

const ListCom = ({ text, index, fetchTasks, deleteTask }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(text);

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${index}`, { task: editedTask });
      setEditMode(false);
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDelete = () => {
    deleteTask(index);
  };

  return (
    <>
      <ListItem>
        {text && text.name && (
          <ListItemText primary={text.name} />
        )}
        <IconButton onClick={() => setEditMode(true)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItem>

      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Task"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListCom;
