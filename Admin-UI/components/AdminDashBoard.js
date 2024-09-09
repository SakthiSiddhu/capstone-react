import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequests, addEmails, clearEmails } from '../redux/adminSlice';
import { useNavigate } from 'react-router-dom';
import NavBarComponent from './NavBarComponent';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const AdminDashboard = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const requests = useSelector((state) => state.admin.requests || []);
  const emails = useSelector((state) => state.admin.emails);
  const error = useSelector((state) => state.admin.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');
  const baseUrl = 'http://localhost:9000/admin';

  useEffect(() => {
    dispatch(fetchRequests());
    const interval = setInterval(() => {
      dispatch(fetchRequests());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleViewClick = (requestid) => {
    navigate(`/request-details/${requestid}`);
  };

  const handleCreateClick = (requestid) => {
    navigate(`/create-course/${requestid}`);
  };

  const handleAddEmployeeClick = () => {
    setShowModal(true);
  };

  const handleEmailSubmit = () => {
    if (currentEmail.trim() !== '') {
      dispatch(addEmails([...emails, currentEmail]));
      setCurrentEmail('');
    }
  };

  const handleSendEmails = async () => {
    try {
      await axios.post(
        `${baseUrl}/employees/addemployees`,
        { emails }, // Ensure the payload is an object with an 'emails' key
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(clearEmails());
      toast.success('Credentials sent successfully');
    } catch (error) {
      console.error('Failed to send emails:', error);
      toast.error('Failed to send emails. Please try again.');
    }
    setShowModal(false);
  };

  const numberOfCoursesCreated = new Set(
    requests.map((request) => request.coursename)
  ).size;

  const numberOfEmployees = new Set(
    requests.map((request) => request.managername)
  ).size;

  const numberOfRequests = requests.length;

  const statistics = {
    numberOfCoursesCreated,
    numberOfEmployees,
    numberOfRequests,
  };

  const pendingRequests = requests.filter(
    (request) => request.status !== 'COMPLETED'
  );

  const completedRequests = requests.filter(
    (request) => request.status === 'COMPLETED'
  );

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <div className="p-6 space-y-6">
      <NavBarComponent onLogout={handleLogout} />
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>
      <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={handleAddEmployeeClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2"
        >
          <span>+ Add Employees</span>
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
              <p className="text-2xl font-bold">
                {statistics.numberOfCoursesCreated}
              </p>
              <p className="text-sm">Courses Created</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
              <p className="text-2xl font-bold">
                {statistics.numberOfEmployees}
              </p>
              <p className="text-sm">Employees</p>
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
              <p className="text-2xl font-bold">
                {statistics.numberOfRequests}
              </p>
              <p className="text-sm">Requests</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">Pending Requests</h4>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Requestor Name</th>
                <th className="text-left">Course</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request) => (
                <tr key={request.requestid}>
                  <td>{request.managername}</td>
                  <td>{request.coursename}</td>
                  <td>
                    <button
                      onClick={() => handleViewClick(request.requestid)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleCreateClick(request.requestid)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 ml-2"
                    >
                      Create
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">Completed Requests</h4>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Requestor Name</th>
                <th className="text-left">Course</th>
              </tr>
            </thead>
            <tbody>
              {completedRequests.map((request) => (
                <tr key={request.requestid}>
                  <td>{request.managername}</td>
                  <td>{request.coursename}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
            <h4 className="text-lg font-semibold mb-2">Add Employees</h4>
            <input
              type="text"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              placeholder="Enter email"
              className="border border-gray-300 p-2 rounded-lg w-full mb-2"
            />
            <button
              onClick={handleEmailSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={handleSendEmails}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
            >
              Send Emails
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
