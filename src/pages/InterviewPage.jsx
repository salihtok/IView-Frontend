import { useState, useEffect } from "react";
import useInterviewStore from "../store/interviewStore";
import Sidebar from "../components/Bar/sidebar";
import InterviewPopup from "../components/Popup/interviewPopup";

export const InterviewList = () => {
  const { interviews, fetchInterviews, deleteInterview, loading, error } =
    useInterviewStore();

  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleDeleteInterview = (id) => {
    deleteInterview(id);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mb-6">Interview List</h2>
            <button
              id="addInterviewBtn"
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => setShowAddPopup(true)}
            >
              +
            </button>
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {loading && <div>Loading...</div>}

          {!loading && interviews && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {interview.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteInterview(interview._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Total: {interview.total || 0}</span>
                      <span>On Hold: {interview.onHold || 0}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm ${
                        interview.published ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {interview.published ? "Published" : "Unpublished"}
                    </span>
                    <button className="text-blue-500 hover:underline">
                      See Videos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddPopup && (
          <InterviewPopup onClose={() => setShowAddPopup(false)} />
        )}
      </div>
    </div>
  );
};

export default InterviewList;
