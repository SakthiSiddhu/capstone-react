import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPowerOff, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const NavBarComponent = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Call the onLogout prop function
    if (onLogout) {
      onLogout();
    }
    // Optionally clear any local state or tokens here
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Hamburger Menu */}
          <button 
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-white text-md font-bold">Learning Hub</span>
          </Link>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold hidden lg:block">Hey Admin!</span>
            <div className="flex items-center">
              <FaUserCircle className="text-white text-2xl" />
              <FaPowerOff 
                onClick={handleLogout}
                className="text-white text-2xl ml-4 cursor-pointer hover:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className={`${isOpen ? 'block' : 'hidden'} mt-4`}>
          <div className="bg-gray-700 p-4 rounded-md">
            <Link to="/" className="block text-white hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">HomePage</Link>
            <Link to="/courses" className="block text-white hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">Courses</Link>
            <Link to="/employee-progress" className="block text-white hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">Employee Progress</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarComponent;
