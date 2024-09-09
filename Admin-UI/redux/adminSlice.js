import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:9001/admin';

// Thunks
export const fetchRequests = createAsyncThunk('admin/fetchRequests', async () => {
  const response = await axios.get(`${baseUrl}/courses/dashboard`);
  return response.data;
});

export const fetchEmployees = createAsyncThunk('admin/fetchEmployees', async () => {
  const response = await axios.get(`${baseUrl}/employees`);
  return response.data;
});

// Slice
export const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    requests: [],
    employees: [],
    emails: [], // Add this to the initial state
    error: null,
    status: 'idle',
  },
  reducers: {
    addEmails: (state, action) => {
      state.emails = [...state.emails, ...action.payload]; // Append emails to the existing state
    },
    clearEmails: (state) => {
      state.emails = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addEmails, clearEmails } = adminSlice.actions;
export default adminSlice.reducer;
