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

  useEffect(() => {
    if (link) {
      fetchInterviewByLink(link); // Interview verisini bir kere yükle
    }
  }, [link, fetchInterviewByLink]);

  const handleFormSubmit = (data) => {
    setFormData(data); // Form verilerini kaydet
    setIsFormSubmitted(true); // Form başarıyla submit edilince video mülakatına geç
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
      {!isFormSubmitted && interview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <PersonalInfoForm onSubmit={handleFormSubmit} />
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