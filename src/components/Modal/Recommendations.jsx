import React from "react";

const Recommendations = ({ result }) => {
  const technicalCount = result.analysis?.keyword_hits?.technical?.length || 0;
  const softSkillsCount =
    result.analysis?.keyword_hits?.soft_skills?.length || 0;
  const positiveEmotion = result.emotion_analysis?.positive || 0;
  const neutralEmotion = result.emotion_analysis?.neutral || 0;
  const negativeEmotion = result.emotion_analysis?.negative || 0;

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Öneriler</h3>
      <ul className="list-disc pl-5 text-gray-700">
        {technicalCount < 2 && (
          <li>Teknik beceriler düşük. Teknik eğitim önerilebilir.</li>
        )}
        {softSkillsCount < 1 && (
          <li>Sosyal beceriler düşük. Takım içi uyumda sorun yaşanabilir.</li>
        )}
        {positiveEmotion > negativeEmotion ? (
          <li>
            Adayın olumlu duyguları baskın. Bu, güçlü bir takım oyuncusu
            olabileceğini gösteriyor.
          </li>
        ) : (
          <li>
            Adayın olumsuz duyguları baskın. Bu durum, stres yönetiminde sorun
            yaratabilir.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Recommendations;
