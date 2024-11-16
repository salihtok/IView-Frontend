import React, { useState, useEffect } from "react";
import useInterviewStore from "../store/interviewStore";
import Sidebar from "../components/Bar/sidebar";
import InterviewPopup from "../components/Popup/interviewPopup";
import EditInterviewPopup from "../components/Popup/editInterview";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Bar/SearchBar";
import AddButton from "../components/Buttons/AddButton";
import EditButton from "../components/Buttons/EditButton";
import DeleteButton from "../components/Buttons/DeleteButton";
import CopyLinkButton from "../components/Buttons/CopyLinkButton";
import LogoutButton from "../components/Buttons/LogoutButton";

export const InterviewList = () => {
  const {
    interviews,
    fetchInterviews,
    deleteInterview,
    publishInterview,
    loading,
    error,
  } = useInterviewStore();

  const navigate = useNavigate();

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleViewVideos = (interviewId) => {
    navigate(`/interview/${interviewId}/candidates`);
  };

  const handleDeleteInterview = (id) => {
    deleteInterview(id);
    toast.success("Interview deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  };

  const handleEditInterview = (interview) => {
    setSelectedInterviewId(interview._id);
    setShowEditPopup(true);
  };

  // Yayın durumunu değiştirme fonksiyonu
  const handleTogglePublish = async (interview) => {
    const newPublishStatus = !interview.publish;
    await publishInterview(interview._id, newPublishStatus);
    if (newPublishStatus) {
      toast.success("Interview published!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.error("Interview unpublished!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const filteredInterviews = interviews?.filter((interview) =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mb-6">Interview List</h2>
            <div className="flex items-center gap-4">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search interviews..."
              />
              <AddButton
                onClick={() => setShowAddPopup(true)}
                id="addInterviewBtn"
              />
              <LogoutButton />
            </div>
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {loading && <div>Loading...</div>}

          {!loading && interviews && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {interview.title}
                    </h3>

                    <div className="py-3 px-4 flex items-center gap-2">
                      <CopyLinkButton interviewId={interview._id} />
                      <EditButton
                        onClick={() => handleEditInterview(interview)}
                      />
                      <DeleteButton
                        onClick={() => handleDeleteInterview(interview._id)}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Total: {interview.total || 0}</span>
                      <span>On Hold: {interview.onHold || 0}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm cursor-pointer ${
                        interview.publish
                          ? "text-green-500 hover:text-green-700"
                          : "text-red-500 hover:text-red-700"
                      }`}
                      onClick={() => handleTogglePublish(interview)}
                    >
                      {interview.publish ? "Published" : "Unpublished"}
                    </span>
                    <button
                      onClick={() => handleViewVideos(interview._id)} // Videolar sayfasına yönlendirme
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                      </svg>
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
        {showEditPopup && (
          <EditInterviewPopup
            interviewId={selectedInterviewId}
            onClose={() => {
              setShowEditPopup(false);
              setSelectedInterviewId(null);
            }}
          />
        )}

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default InterviewList;
