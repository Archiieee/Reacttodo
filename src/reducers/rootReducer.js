import { combineReducers } from 'redux';
import { createSlice } from '@reduxjs/toolkit';
import authReducer from './authReducer'; 

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export const counterReducer = counterSlice.reducer;



const rootReducer = combineReducers({
  auth: authReducer, 
  
});

export default rootReducer;
