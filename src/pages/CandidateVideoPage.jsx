// CandidateList.js
import React, { useEffect, useState } from "react";
import useCandidateStore from "../store/candidateStore";
import useVideoStore from "../store/videoStore";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Bar/sidebar";
import DeleteButton from "../components/Buttons/DeleteButton";
import LogoutButton from "../components/Buttons/LogoutButton";
import SearchBar from "../components/Bar/SearchBar";
import VideoModal from "../components/Popup/VideoModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaChartBar } from "react-icons/fa";

const CandidateList = () => {
  const {
    candidates,
    fetchCandidatesForInterview,
    analyzeCandidateVideo,
    updateCandidateStatus,
    loading,
    error,
    deleteCandidate,
  } = useCandidateStore();
  const { deleteVideo, fetchVideoById } = useVideoStore();
  const { interviewId } = useParams();

  const [videos, setVideos] = useState({});
  const [openModal, setOpenModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoError, setVideoError] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState({});
  const [analysisInProgress, setAnalysisInProgress] = useState({});

  useEffect(() => {
    fetchCandidatesForInterview(interviewId);
  }, [interviewId]);

  useEffect(() => {
    const interval = setInterval((candidateId) => {
      // Check for analysis completion
      const candidate = candidates.find((cand) => cand._id === candidateId);
      if (candidate?.result) {
        clearInterval(interval); // Stop polling if results are ready
        toast.success("Analysis complete");
      }
    }, 9000); // Poll every 9 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [candidates]);

  const handleAnalyzeVideo = async (candidateId, videoUrl) => {
    if (analysisInProgress[candidateId]) {
      toast.info("Analysis already in progress.");
      return;
    }

    setAnalysisInProgress((prev) => ({ ...prev, [candidateId]: true }));

    try {
      const response = await analyzeCandidateVideo(candidateId, videoUrl);
      console.log("Analiz Sonuçları:", response.data);

      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Analiz işlemi sırasında hata oluştu:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setAnalysisInProgress((prev) => ({ ...prev, [candidateId]: false }));
    }
  };


  const handleDelete = async (candidateId, videoId) => {
    try {
      await deleteVideo(videoId);
      await deleteCandidate(candidateId);
      setVideos((prevVideos) => {
        const updatedVideos = { ...prevVideos };

        delete updatedVideos[candidateId];

        return updatedVideos;
      });
      toast.success("Candidate deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (err) {
      console.error("Error during delete operation:", err);
      toast.error("Delete failed: Video not found or already deleted", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleStatusChange = async (candidateId, status) => {
    try {
      await updateCandidateStatus(candidateId, status);
      setOpenModal(null);
      toast.success("Status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const handleViewVideo = async (candidateId, videoKey) => {
    try {
      const signedUrl = await fetchVideoById(videoKey); // Signed URL al
      setVideos((prev) => ({ ...prev, [candidateId]: signedUrl })); // Candidate ID ile eşleştir
      setOpenModal(candidateId);
      setVideoError(null);
    } catch (error) {
      setVideoError("Video yüklenemedi.");
    }
  };

  const filteredCandidates = candidates.filter((candidate) =>
    `${candidate.firstName} ${candidate.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 flex-1 overflow-auto bg-gray-100">
          <div className="bg-[#F0FAF9] shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                Candidates for Interview
              </h2>
              <div className="flex items-center gap-4">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  placeholder="Search candidates..."
                />
                <LogoutButton />
              </div>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="text-gray-600">
                No candidates match your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="bg-white shadow-lg rounded-lg p-4 flex flex-col relative"
                  >
                    <div className="absolute top-2 right-2">
                      <DeleteButton
                        onClick={() =>
                          handleDelete(candidate._id, candidate.videoUrl)
                        }
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold break-words">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="break-words">{candidate.email}</p>
                    <p className="break-words">{candidate.phone}</p>

                    <button
                      onClick={() =>
                        setShowAnalysis((prev) => ({
                          ...prev,
                          [candidate._id]: !prev[candidate._id],
                        }))
                      }
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mt-2 mb-1"
                    >
                      {showAnalysis[candidate._id] ? (
                        <>
                          <FaEyeSlash className="w-4 h-4" /> Hide Analysis
                        </>
                      ) : (
                        <>
                          <FaEye className="w-4 h-4" /> Show Analysis
                        </>
                      )}
                    </button>

                    {showAnalysis[candidate._id] && (
                      <>
                        <p className="break-words">
                          Transcription:{" "}
                          {candidate.result?.transcription || "N/A"}
                        </p>
                        <p className="break-words">
                          Face Analysis:{" "}
                          {JSON.stringify(candidate.result?.face_analysis) ||
                            "N/A"}
                        </p>
                      </>
                    )}
                    <p>Status: {candidate.status}</p>
                    <div className="mt-4 flex gap-3">
                      {candidate.videoUrl ? (
                        <button
                          onClick={() =>
                            handleViewVideo(candidate._id, candidate.videoUrl)
                          }
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View Video
                        </button>
                      ) : (
                        <p className="text-gray-500">Video bulunamadı</p>
                      )}

                      <button
                        onClick={() =>
                          handleAnalyzeVideo(candidate._id, candidate.videoUrl)
                        }
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                      >
                        <FaChartBar className="w-4 h-4" />
                        Analyze
                      </button>
                    </div>
                    {openModal === candidate._id && videos[candidate._id] && (
                      <VideoModal
                        candidate={candidate}
                        videoUrl={videos[candidate._id]} // Signed URL'yi kullan
                        onClose={() => setOpenModal(null)}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        error={!videos[candidate._id] || videoError}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CandidateList;
