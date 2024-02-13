import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/id/${taskId}`);
        setTask(response.data); 
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };
    fetchTaskDetails();
  }, [taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Task Details</h2>
      <p>Name: {task.name || 'Not available'}</p>
      <p>Category: {task.category || 'Not available'}</p>
    </div>
  );
};

export default TaskDetails;
