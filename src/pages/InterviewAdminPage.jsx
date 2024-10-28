import React, { useState, useEffect } from "react";
import useInterviewStore from "../store/interviewStore";
import useLinkStore from "../store/linkStore";
import Sidebar from "../components/Bar/sidebar";
import InterviewPopup from "../components/Popup/interviewPopup";
import EditInterviewPopup from "../components/Popup/editInterview";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const InterviewList = () => {
  const {
    interviews,
    fetchInterviews,
    deleteInterview,
    publishInterview,
    loading,
    error,
  } = useInterviewStore();

  const navigate = useNavigate(); // Kullanıcıyı yönlendirmek için
  const { generateInterviewLink } = useLinkStore();

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleViewVideos = (interviewId) => {
    navigate(`/interview/${interviewId}/videos`);
  };

  const handleDeleteInterview = (id) => {
    deleteInterview(id);
  };

  const handleEditInterview = (interview) => {
    setSelectedInterviewId(interview._id);
    setShowEditPopup(true);
  };

  const handleCopyLink = async (id) => {
    try {
      await generateInterviewLink(id);
      const updatedLink = await useLinkStore.getState().interviewLink;

      if (updatedLink) {
        await navigator.clipboard.writeText(updatedLink);
        toast.success("Link başarıyla kopyalandı: " + updatedLink);
      } else {
        toast.error("Link oluşturulamadı.");
      }
    } catch (error) {
      console.error("Link kopyalanamadı", error);
      toast.error("Link kopyalanırken bir hata oluştu.");
    }
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
                    <div>
                      <button
                        onClick={() => handleCopyLink(interview._id)}
                        className="text-green-500 hover:underline mr-2"
                      >
                        Link
                      </button>
                      <button
                        onClick={() => handleEditInterview(interview)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInterview(interview._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Total: {interview.total || 0}</span>
                      <span>On Hold: {interview.onHold || 0}</span>
                    </div>
                  </div>

                  {/* Yayın durumunu gösteren ve tıklanarak toogle edilen alan */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm cursor-pointer ${
                        interview.publish ? "text-green-600" : "text-red-500"
                      }`}
                      onClick={() => handleTogglePublish(interview)}
                    >
                      {interview.publish ? "Published" : "Unpublished"}
                    </span>
                    <button
                        onClick={() => handleViewVideos(interview._id)} // Videolar sayfasına yönlendirme
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Videolar
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
          autoClose={3000}
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