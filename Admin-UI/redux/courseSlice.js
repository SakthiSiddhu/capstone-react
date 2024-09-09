import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:9001/admin';

// Thunks for fetching data
export const fetchCourses = createAsyncThunk('course/fetchCourses', async () => {
  const response = await axios.get(`${baseUrl}/courses`);
  return response.data;
});

export const fetchCourseDetails = createAsyncThunk('course/fetchCourseDetails', async (courseid) => {
  const response = await axios.get(`${baseUrl}/courses/${courseid}`);
  return response.data;
});

export const fetchCourseEmployees = createAsyncThunk('course/fetchCourseEmployees', async (coursename) => {
  const response = await axios.get(`${baseUrl}/courses/employees/${coursename}`);
  return response.data;
});

export const fetchAllEmployees = createAsyncThunk('course/fetchAllEmployees', async () => {
  const response = await axios.get(`${baseUrl}/employees`);
  return response.data;
});

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    course: {},
    employees: [],
    assignedEmployees: [],
    selectedEmployees: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectEmployee: (state, action) => {
      const username = action.payload;
      if (state.selectedEmployees.includes(username)) {
        state.selectedEmployees = state.selectedEmployees.filter(emp => emp !== username);
      } else {
        state.selectedEmployees.push(username);
      }
    },
    clearSelectedEmployees: (state) => {
      state.selectedEmployees = [];
    },
    updateCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCourseEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseEmployees.fulfilled, (state, action) => {
        state.loading = false;
        const assignedEmployees = action.payload.map(emp => emp.username);
        state.assignedEmployees = assignedEmployees;
        state.employees = state.employees.filter(emp => !assignedEmployees.includes(emp.username));
      })
      .addCase(fetchCourseEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { selectEmployee, clearSelectedEmployees, updateCourses } = courseSlice.actions;
export default courseSlice.reducer;
