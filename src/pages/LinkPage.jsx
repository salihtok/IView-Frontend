import { useEffect, useState } from "react";
import PersonalInfoForm from "./PersonelInfoForm";
import InterviewPage from "./InterviewCandidate";
import useLinkStore from "../store/linkStore";

function CandidateLink({ link }) {
  const { fetchInterviewByLink, interview, error } = useLinkStore();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    if (link) {
      fetchInterviewByLink(link); // Link geçildiğinde mülakatı getir
    }
  }, [link, fetchInterviewByLink]);

  const handleFormSubmit = () => {
    setIsFormSubmitted(true); // Form başarıyla submit edilince video mülakatına geç
  };

  return (
    <div className="App">
      {error && <div className="error">{error}</div>} {/* Hata mesajı */}
      {!isFormSubmitted && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <PersonalInfoForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}
      {isFormSubmitted && <InterviewPage interview={interview} />}{" "}
      {/* Form submit edildikten sonra mülakat sayfası */}
    </div>
  );
}

export default CandidateLink;
