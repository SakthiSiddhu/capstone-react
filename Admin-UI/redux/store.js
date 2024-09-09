import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';
import courseReducer from './courseSlice';
import courseCreationReducer from './courseCreationSlice';

const store = configureStore({
  reducer: {
    admin: adminReducer,
    course: courseReducer,
    courseCreation: courseCreationReducer,
  },
});

export default store;
