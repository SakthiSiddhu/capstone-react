import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/courseSlice'
import { fetchFeedbacks } from '../redux/feedbackSlice'
import { useEffect } from 'react';
import { toggleFeedbackModal } from '../redux/feedbackSlice'
import FeedbackModal from './FeedbackModal'; // Ensure this component is created

const RequestDetails = () => {
  const { courseid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const course = useSelector((state) => state.course.course);
  const feedbacks = useSelector((state) => state.feedback.feedbacks);
  const showModal = useSelector((state) => state.feedback.showModal);

  useEffect(() => {
    dispatch(fetchCourses(courseid));
    dispatch(fetchFeedbacks(courseid));
  }, [courseid, dispatch]);

  const handleFeedbackModal = () => {
    dispatch(toggleFeedbackModal());
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{course?.coursename}</h1>
      <p>{course?.description}</p>

      <button
        onClick={handleFeedbackModal}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
      >
        View Feedback
      </button>

      {showModal && <FeedbackModal />}

      <div className="mt-4">
        <h2 className="text-xl font-bold">Feedbacks</h2>
        <ul>
          {feedbacks.map((feedback, index) => (
            <li key={index} className="border-b py-2">
              <p><strong>Rating:</strong> {feedback.rating}</p>
              <p><strong>Comments:</strong> {feedback.comments}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RequestDetails;
