import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseDetails, fetchCourseEmployees, fetchAllEmployees, selectEmployee } from '../redux/courseSlice'
import { useParams, useNavigate } from 'react-router-dom';
import NavBarComponent from './NavBarComponent';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const CourseAssignment = () => {
  const { courseid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const course = useSelector((state) => state.course.course);
  const employees = useSelector((state) => state.course.employees);
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    dispatch(fetchCourseDetails(courseid));
    dispatch(fetchCourseEmployees(courseid));
    dispatch(fetchAllEmployees());
  }, [dispatch, courseid]);

  const handleEmployeeSelect = (username) => {
    dispatch(selectEmployee(username));
  };

  const handleAssignCourse = async () => {
    const selectedEmployees = employees.filter((emp) => emp.selected);

    try {
      await axios.post(
        `http://localhost:9001/admin/courses/assign/${courseid}`,
        selectedEmployees,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success('Course assigned successfully');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error("Failed to assign course:", error);
      toast.error("Failed to assign course. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <NavBarComponent />
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Assign Course</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
        <p className="text-sm">{course.description}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h4 className="text-lg font-semibold mb-2">Employees</h4>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Profile</th>
              <th className="text-left">Name</th>
              <th className="text-left">Role</th>
              <th className="text-left">Select</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.username}>
                <td><img src={employee.profilePic} alt="Profile" className="w-8 h-8 rounded-full" /></td>
                <td>{employee.name}</td>
                <td>{employee.role}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={employee.selected || false}
                    onChange={() => handleEmployeeSelect(employee.username)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleAssignCourse}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Assign Course
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CourseAssignment;
