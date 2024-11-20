import React, { useEffect, useState } from "react";
import PersonalInfoForm from "./PersonelInfoForm";
import InterviewPage from "./InterviewCandidate";
import useLinkStore from "../store/linkStore";
import { useParams } from "react-router-dom";

function CandidateLink() {
  const { uuid: link } = useParams(); // Link parametresini alıyoruz
  console.log("Linkcandidate:", link);
  const { fetchInterviewByLink, interview, error, loading } = useLinkStore();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(null); // Form verilerini saklamak için state
  const [showPreparationStep, setShowPreparationStep] = useState(false);

  useEffect(() => {
    if (link) {
      fetchInterviewByLink(link); // Interview verisini bir kere yükle
    }
  }, [link, fetchInterviewByLink]);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowPreparationStep(true); // Show preparation step instead of direct interview
  };

  const handleStartInterview = () => {
    setIsFormSubmitted(true);
    setShowPreparationStep(false);
  };

  // Yüklenme durumunda veya hata varsa formu gösterme
  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      {!isFormSubmitted && !showPreparationStep && interview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <PersonalInfoForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}
      
      {showPreparationStep && !isFormSubmitted && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Before You Start</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="mr-2">🌐</span>
                Please ensure you have a stable internet connection
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎥</span>
                Check that your camera is working and properly positioned
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎤</span>
                Test your microphone and make sure it's allowed in your browser
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔒</span>
                Allow browser permissions for camera and microphone access
              </li>
            </ul>
            <button
              onClick={handleStartInterview}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              I'm Ready to Start
            </button>
          </div>
        </div>
      )}

      {isFormSubmitted && interview && (
        <InterviewPage interview={interview} formData={formData} />
      )}
    </div>
  );
}

export default CandidateLink;