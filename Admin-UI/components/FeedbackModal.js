import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(1);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Feedback submitted:', { feedback, rating });
    // Close the modal after submission
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-gray-700 mb-2">Your Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              required
              className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-700 mb-2">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={handleRatingChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FeedbackModal;
