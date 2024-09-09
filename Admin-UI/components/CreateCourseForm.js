// CreateCourseForm.js
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {
  updateFormData,
  addResourceLink,
  removeResourceLink,
  resetForm,
  createCourse,
  clearError
} from '../redux/courseCreationSlice'

const CreateCourseForm = () => {
  const baseUrl = 'http://localhost:9001/admin';
  const { requestid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    formData,
    resourceLinks,
    loading,
    error,
    success
  } = useSelector((state) => state.courseCreation);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`${baseUrl}/courses/dashboard/view/${requestid}`);
        dispatch(updateFormData({ name: 'requestid', value: response.data.requestid }));
        dispatch(updateFormData({ name: 'accountid', value: response.data.accountid }));
        dispatch(updateFormData({ name: 'managername', value: response.data.managername }));
        dispatch(updateFormData({ name: 'coursename', value: response.data.coursename }));
        dispatch(updateFormData({ name: 'description', value: response.data.description }));
        dispatch(updateFormData({ name: 'concepts', value: response.data.concepts }));
        dispatch(updateFormData({ name: 'outcomes', value: '' }));
        dispatch(updateFormData({ name: 'resourcelinks', value: '' }));
        dispatch(updateFormData({ name: 'otherlinks', value: '' }));
      } catch (error) {
        toast.error('Error fetching course edit details');
        console.error(error);
      }
    };
    fetchRequest();
  }, [dispatch, requestid]);

  useEffect(() => {
    if (success) {
      toast.success('Course created successfully!');
      setTimeout(() => navigate('/courses'), 4000);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ name, value }));
  };

  const isValidYouTubeURL = (url) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/watch\?v=([^&]+)/m;
    return regex.test(url);
  };

  const handleAddLink = () => {
    if (!isValidYouTubeURL(formData.resourcelinks)) {
      toast.error('Enter a valid link');
      dispatch(updateFormData({ name: 'resourcelinks', value: '' }));
      return;
    }
    dispatch(addResourceLink(formData.resourcelinks));
  };

  const handleRemoveLink = (index) => {
    dispatch(removeResourceLink(index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        resourcelinks: resourceLinks.join(', ')
      };
      await dispatch(createCourse(courseData)).unwrap();
    } catch (error) {
      toast.error('Error creating course');
      console.error(error);
    }
  };

  const handleReset = () => {
    dispatch(resetForm());
  };

  return (
    <div className="p-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back
      </button>
      <h1 className="text-3xl font-bold text-gray-900">Create Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        {Object.keys(formData).map((key) => (
          key !== 'resourcelinks' && key !== 'otherlinks' && key !== 'outcomes' && (
            <div key={key}>
              <label className="block text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
                disabled={['requestid', 'accountid', 'managername', 'coursename', 'description', 'concepts'].includes(key)}
              />
            </div>
          )
        ))}
        <div>
          <label className="block text-gray-700">Resource Links</label>
          <input
            type="text"
            name="resourcelinks"
            value={formData.resourcelinks}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
          >
            Add
          </button>
          <ul className="mt-4">
            {resourceLinks.map((link, index) => (
              <li key={index} className="flex justify-between items-center">
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {link}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block text-gray-700">Other Links</label>
          <input
            type="text"
            name="otherlinks"
            value={formData.otherlinks}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Outcomes</label>
          <input
            type="text"
            name="outcomes"
            value={formData.outcomes}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCourseForm;
