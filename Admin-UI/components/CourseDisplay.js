import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCourses } from '../redux/courseSlice'; // Adjust the import path if necessary
import CourseAssignment from './CourseAssignment';

const CourseDisplay = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.course.courses);
  const loading = useSelector((state) => state.course.loading);
  const error = useSelector((state) => state.course.error);

  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [showAssignment, setShowAssignment] = React.useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error('Error fetching courses');
    }
  }, [error]);

  const handleAddLearnersClick = (courseid) => {
    setSelectedCourse(courseid);
    setShowAssignment(true);
  };

  const handleCloseAssignment = () => {
    setShowAssignment(false);
    setSelectedCourse(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.courseid} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.coursename}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <p className="text-gray-600 mb-4"><strong>Duration:</strong> {course.duration}</p>
            
            <div className="flex space-x-4">
              {/* View Button */}
              <Link
                to={`/view-course/${course.courseid}`}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                View
              </Link>
              {/* Edit Button */}
              <Link
                to={`/edit-course/${course.courseid}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </Link>
              {/* Add Learners Button */}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleAddLearnersClick(course.courseid)}
              >
                Add Learners
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAssignment && selectedCourse && (
        <CourseAssignment
          courseid={selectedCourse}
          onClose={handleCloseAssignment}
        />
      )}
    </div>
  );
};

export default CourseDisplay;
