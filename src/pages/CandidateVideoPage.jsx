import React, { useEffect, useState } from "react";
import useCandidateStore from "../store/candidateStore";
import useVideoStore from "../store/videoStore";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Bar/sidebar";
import DeleteButton from "../components/Buttons/DeleteButton";
import LogoutButton from "../components/Buttons/LogoutButton";
import SearchBar from "../components/Bar/SearchBar";

const CandidateList = () => {
  const {
    candidates,
    fetchCandidatesForInterview,
    updateCandidateStatus, // Status update function
    loading,
    error,
    deleteCandidate,
  } = useCandidateStore();

  const { fetchVideoById, deleteVideo } = useVideoStore();
  const { interviewId } = useParams();

  const [videos, setVideos] = useState({});
  const [openModal, setOpenModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCandidatesForInterview(interviewId);
  }, [interviewId, fetchCandidatesForInterview]);

  useEffect(() => {
    const fetchVideosForCandidates = async () => {
      const updatedVideos = await Promise.all(
        candidates.map(async (candidate) => {
          try {
            const videoData = await fetchVideoById(candidate.videoUrl);
            if (!videoData || !videoData.url) {
              console.error("Video URL not found:", videoData);
              return null;
            }
            return { [candidate._id]: videoData.url };
          } catch (err) {
            console.error("Failed to load video:", err);
            return null;
          }
        })
      );
      setVideos(Object.assign({}, ...updatedVideos.filter(Boolean)));
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
                  {videos[candidate._id] && (
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => setOpenModal(candidate._id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path d="M3 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3ZM15 4.75a.75.75 0 0 0-1.28-.53l-2 2a.75.75 0 0 0-.22.53v2.5c0 .199.079.39.22.53l2 2a.75.75 0 0 0 1.28-.53v-6.5Z" />
                        </svg>
                      </button>
                      <DeleteButton
                        onClick={() =>
                          handleDelete(candidate._id, candidate.videoUrl)
                        }
                      />
                    </div>
                  )}
                  {openModal === candidate._id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
                        <button
                          onClick={() => setOpenModal(null)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-6"
                          >
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                          </svg>
                        </button>
                        <video width="100%" controls>
                          <source
                            src={videos[candidate._id]}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        <div className="mt-4 flex justify-between">
                          <button
                            onClick={() =>
                              handleStatusChange(candidate._id, "passed")
                            }
                            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(candidate._id, "failed")
                            }
                            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
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
