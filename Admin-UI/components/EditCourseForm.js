import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, updateCourses } from '../redux/courseSlice'
import NavBarComponent from './NavBarComponent';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCourseForm = () => {
  const baseUrl = "http://localhost:9001/admin";
  const { courseid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const course = useSelector((state) => state.course.course);
  const loading = useSelector((state) => state.course.loading);
  const error = useSelector((state) => state.course.error);

  const [formData, setFormData] = useState({
    coursename: '',
    description: '',
    duration: '',
    keyConcepts: '',
    otherlinks: '',
    outcomes: '',
    resourcelinks: '',
  });

  const [resourcelinks, setResourcelinks] = useState([]);
  const [otherlinks, setOtherlinks] = useState([]);
  const [outcomes, setOutcomes] = useState([]);

  useEffect(() => {
    dispatch(fetchCourses(courseid));
  }, [courseid, dispatch]);

  useEffect(() => {
    if (course) {
      setFormData({
        coursename: course.coursename,
        description: course.description,
        duration: course.duration,
        keyConcepts: course.keyConcepts,
        otherlinks: course.otherlinks,
        outcomes: course.outcomes,
        resourcelinks: '',
      });
      setResourcelinks(course.resourcelinks ? course.resourcelinks.split(', ') : []);
      setOtherlinks(course.otherlinks ? course.otherlinks.split(', ') : []);
      setOutcomes(course.outcomes ? course.outcomes.split(', ') : []);
    }
  }, [course]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddLink = () => {
    if (formData.resourcelinks.trim() === '') return;
    setResourcelinks((prevLinks) => [...prevLinks, formData.resourcelinks.trim()]);
    setFormData({ ...formData, resourcelinks: '' });
  };

  const handleRemoveLink = (index) => {
    setResourcelinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateCourses({ courseId: courseid, courseData: { ...formData, resourcelinks: resourcelinks.join(', ') } }));
      toast.success('Course updated successfully!');
      setTimeout(() => navigate(-1), 4000);
    } catch (error) {
      toast.error('Error updating course.');
      console.error("Error updating course:", error);
    }
  };

  const handleReset = () => {
    setFormData({
      otherlinks: '',
      outcomes: '',
      resourcelinks: '',
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <NavBarComponent />

      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Back
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
        {/* Form fields */}
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="coursename" className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              name="coursename"
              id="coursename"
              value={formData.coursename}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              disabled
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="text"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="keyConcepts" className="block text-sm font-medium text-gray-700">Key Concepts</label>
            <textarea
              name="keyConcepts"
              id="keyConcepts"
              value={formData.keyConcepts}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              disabled
            ></textarea>
          </div>

          <div>
            <label htmlFor="resourcelinks" className="block text-sm font-medium text-gray-700">Resource Links</label>
            <input
              type="text"
              name="resourcelinks"
              id="resourcelinks"
              value={formData.resourcelinks}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Link
            </button>
            <ul className="mt-2">
              {resourcelinks.map((link, index) => (
                <li key={index} className="flex items-center justify-between mt-1">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{link}</a>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label htmlFor="otherlinks" className="block text-sm font-medium text-gray-700">Other Links</label>
            <input
              type="text"
              name="otherlinks"
              id="otherlinks"
              value={formData.otherlinks}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="outcomes" className="block text-sm font-medium text-gray-700">Outcomes</label>
            <input
              type="text"
              name="outcomes"
              id="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditCourseForm;
