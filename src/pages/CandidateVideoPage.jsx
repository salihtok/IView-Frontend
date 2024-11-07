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

const CandidateList = () => {
  const {
    candidates,
    fetchCandidatesForInterview,
    updateCandidateStatus,
    loading,
    error,
    deleteCandidate,
  } = useCandidateStore();
  const { fetchVideoById, deleteVideo } = useVideoStore();
  const { interviewId } = useParams();

  const [videos, setVideos] = useState({});
  const [openModal, setOpenModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoError, setVideoError] = useState(null);

  useEffect(() => {
    fetchCandidatesForInterview(interviewId);
  }, [interviewId, fetchCandidatesForInterview]);

  useEffect(() => {
    const fetchVideosForCandidates = async () => {
      const updatedVideos = await Promise.all(
        candidates.map(async (candidate) => {
          try {
            const videoData = await fetchVideoById(candidate.videoUrl);
            return { [candidate._id]: videoData?.url || null };
          } catch (err) {
            console.error("Failed to load video:", err);
            return { [candidate._id]: null };
          }
        })
      );
      setVideos(Object.assign({}, ...updatedVideos));
    };

    if (candidates.length > 0) {
      fetchVideosForCandidates();
    }
  }, [candidates, fetchVideoById]);

  const handleDelete = async (candidateId, videoId) => {
    try {
      await deleteVideo(videoId);
      await deleteCandidate(candidateId);
    } catch (err) {
      console.error("Error during delete operation:", err);
      alert(
        "Silme işlemi başarısız: Video bulunamadı veya daha önce silinmiş olabilir."
      );
    }
  };

  const handleStatusChange = async (candidateId, status) => {
    try {
      await updateCandidateStatus(candidateId, status);
      setOpenModal(null);
    } catch (error) {
      console.error("Failed to update status:", error);
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mb-6">Candidates for Interview</h2>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="bg-white shadow-lg rounded-lg p-4"
                >
                  <h3 className="text-xl font-semibold">
                    {candidate.firstName} {candidate.lastName}
                  </h3>
                  <p>{candidate.email}</p>
                  <p>{candidate.phone}</p>
                  <p>Status: {candidate.status}</p>
                  <div className="mt-4 flex justify-between">
                    {/* Video varsa "View Video" butonunu, yoksa "Video bulunamadı" mesajını göster */}
                    {videos[candidate._id] ? (
                      <button
                        onClick={() => {
                          setOpenModal(candidate._id);
                          setVideoError(null);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Video
                      </button>
                    ) : (
                      <p className="text-gray-500">Video bulunamadı</p>
                    )}
                    {/* Sil butonu her zaman gösterilir */}
                    <DeleteButton
                      onClick={() =>
                        handleDelete(candidate._id, candidate.videoUrl)
                      }
                    />
                  </div>
                  {openModal === candidate._id && (
                    <VideoModal
                      candidate={candidate}
                      videoUrl={videos[candidate._id]}
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
  );
};

export default CandidateList;
