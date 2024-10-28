// VideoListPage.js
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useVideoStore from "../store/videoStore";

const VideoListPage = () => {
  const { interviewId } = useParams(); // Parametre olarak interviewId alıyoruz
  const { videos, fetchVideos, loading, error } = useVideoStore();

  useEffect(() => {
    fetchVideos(); // Tüm videoları getir
  }, []);

  // Belirli bir mülakata ait videoları filtrele
  const filteredVideos = videos.filter((video) => video.interviewId === interviewId);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Interview Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video._id} className="bg-white p-4 shadow-lg rounded-lg">
              <video controls src={video.url} className="w-full h-48 rounded-lg mb-4" />
              <p className="text-center font-semibold">{video.title || "Untitled Video"}</p>
            </div>
          ))
        ) : (
          <p>Bu mülakata ait video bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default VideoListPage;