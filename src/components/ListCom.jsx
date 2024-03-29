import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';

const ListCom = ({ text, index, fetchTasks, deleteTask }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(text);

  const handleEdit = () => {
    setEditedTask(text);
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${text._id}`, editedTask);
      setEditMode(false);
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${text._id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <>
      <ListItem>
        {text && text.name && (
          <ListItemText primary={text.name} />
        )}
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <Link to={`/task/${text._id}`}>View Details</Link> {}
      </ListItem>

      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Task"
            value={editedTask.name}
            onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListCom;