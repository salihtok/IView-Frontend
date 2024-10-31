import React, { useEffect, useState } from "react";
import useCandidateStore from "../store/candidateStore";
import useVideoStore from "../store/videoStore";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Bar/sidebar";

const CandidateList = () => {
  const {
    candidates,
    fetchCandidatesForInterview,
    loading,
    error,
    deleteCandidate,
  } = useCandidateStore();
  const { fetchVideoById, deleteVideo } = useVideoStore();
  const { interviewId } = useParams();

  const [videos, setVideos] = useState({});
  const [openModal, setOpenModal] = useState(null);

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
              console.error("Video URL bulunamadı:", videoData);
              return null;
            }
            return { [candidate._id]: videoData.url };
          } catch (err) {
            console.error("Video yüklenemedi:", err);
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
      // Sil video
      await deleteVideo(videoId);
      console.log(`Video deleted successfully: ${videoId}`);

      // Sil adayı
      await deleteCandidate(candidateId);
      console.log(`Candidate deleted successfully: ${candidateId}`);
    } catch (err) {
      console.error("Error during delete operation:", err);
      // Handle the error appropriately
      // For example, you might want to show an error message to the user
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold mb-6">
              Candidates for Interview
            </h2>
          </div>
          {candidates.length === 0 ? (
            <div className="text-gray-600">
              Bu mülakat için katılan aday yok.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="bg-white shadow-lg rounded-lg p-4"
                >
                  <h3 className="text-xl font-semibold">
                    {candidate.firstName} {candidate.lastName}
                  </h3>

                  <p>Email: {candidate.email}</p>
                  {videos[candidate._id] && (
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => setOpenModal(candidate._id)}
                        className="text-blue-500 underline"
                      >
                        Videoyu İzle
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(candidate._id, candidate.videoUrl)
                        }
                        className="text-red-500 underline"
                      >
                        Adayı Sil
                      </button>
                    </div>
                  )}

                  {openModal === candidate._id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-4 rounded-lg max-w-md w-full relative">
                        <button
                          onClick={() => setOpenModal(null)}
                          className="absolute top-2 right-2 text-gray-700"
                        >
                          Kapat
                        </button>
                        <video width="100%" controls>
                          <source
                            src={videos[candidate._id]}
                            type="video/mp4"
                          />
                          Tarayıcınız video etiketini desteklemiyor.
                        </video>
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
