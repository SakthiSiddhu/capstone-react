// slices/feedbackSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = "http://localhost:9001/admin";

export const fetchFeedbacks = createAsyncThunk('feedback/fetchFeedbacks', async (courseId) => {
  const response = await axios.get(`${baseUrl}/courses/${courseId}/feedbacks`);
  return response.data;
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    error: null,
    showModal: false,
  },
  reducers: {
    toggleFeedbackModal: (state) => {
      state.showModal = !state.showModal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { toggleFeedbackModal } = feedbackSlice.actions;

export default feedbackSlice.reducer;
