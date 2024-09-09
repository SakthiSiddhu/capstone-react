// courseCreationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:9001/admin';

export const createCourse = createAsyncThunk('course/createCourse', async (courseData) => {
  const response = await axios.post(`${baseUrl}/courses/create/${courseData.requestid}`, courseData);
  return response.data;
});

const courseCreationSlice = createSlice({
  name: 'courseCreation',
  initialState: {
    formData: {
      requestid: '',
      accountid: '',
      managername: '',
      coursename: '',
      description: '',
      concepts: '',
      outcomes: '',
      resourcelinks: '',
      otherlinks: ''
    },
    resourceLinks: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    updateFormData: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    addResourceLink: (state, action) => {
      state.resourceLinks = [action.payload, ...state.resourceLinks];
      state.formData.resourcelinks = '';
    },
    removeResourceLink: (state, action) => {
      state.resourceLinks = state.resourceLinks.filter((_, index) => index !== action.payload);
    },
    resetForm: (state) => {
      state.formData = {
        requestid: '',
        accountid: '',
        managername: '',
        coursename: '',
        description: '',
        concepts: '',
        outcomes: '',
        resourcelinks: '',
        otherlinks: ''
      };
      state.resourceLinks = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
      });
  }
});

export const {
  updateFormData,
  addResourceLink,
  removeResourceLink,
  resetForm,
  clearError
} = courseCreationSlice.actions;

export default courseCreationSlice.reducer;
