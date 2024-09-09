import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/courseSlice'
import { useEffect } from 'react';

const ViewCourse = () => {
  const { courseid } = useParams();
  const dispatch = useDispatch();
  const course = useSelector((state) => state.course.course);
  const loading = useSelector((state) => state.course.loading);
  const error = useSelector((state) => state.course.error);

  useEffect(() => {
    dispatch(fetchCourses(courseid));
  }, [courseid, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{course?.coursename}</h1>
      <p>{course?.description}</p>
      {/* Render other course details as needed */}
    </div>
  );
};

export default ViewCourse;
