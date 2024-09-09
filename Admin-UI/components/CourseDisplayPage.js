import React from 'react';
import CourseDisplay from '../components/CourseDisplay';
import NavBarComponent from '../components/NavBarComponent';
import { useNavigate } from 'react-router';

const CourseDisplayPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <NavBarComponent />

      <header className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/admin-dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 text-center flex-grow">Courses</h1>
      </header>
      
      <main>
        <CourseDisplay />
      </main>
    </div>
  );
};

export default CourseDisplayPage;