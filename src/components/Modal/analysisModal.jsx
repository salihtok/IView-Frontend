import React from "react";
import { RadarChart, BarChart, PieChart } from "../Charts/charts";
import Recommendations from "../Modal/Recommendations";
import PDFExporter from "../Utilities/PDFExporter";

const AnalysisModal = ({ candidate, onClose }) => {
  if (!candidate || !candidate.result) {
    console.warn("Analysis data is missing for candidate:", candidate);
    return null;
  }

  const { firstName, lastName, result } = candidate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl relative overflow-auto">
        <button
          onClick={onClose}
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
        <div className="modal-content bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl relative overflow-auto">
          <h2 className="text-xl font-bold mb-4">
            Analysis for {firstName} {lastName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Radar Chart */}
            <div>
              <h3 className="text-lg font-bold">Radar Chart</h3>
              <p className="text-gray-600 mb-2">
                Teknik ve sosyal becerilerin bir aday için nasıl dengelendiğini
                gösterir.
              </p>
              <RadarChart data={result.analysis} />
            </div>
            {/* Bar Chart */}
            <div>
              <h3 className="text-lg font-bold">Bar Chart</h3>
              <p className="text-gray-600 mb-2">
                Her bir sorunun aday tarafından nasıl cevaplandığını ve
                benzerlik skorlarını gösterir.
              </p>
              <BarChart data={result.analysis?.question_similarity || []} />
            </div>
            {/* Pie Chart */}
            <div>
              <h3 className="text-lg font-bold">Pie Chart</h3>
              <p className="text-gray-600 mb-2">
                Duygu analiz sonuçlarına göre adayın duygu durum dağılımını
                temsil eder.
              </p>
              <PieChart data={result.emotion_analysis || {}} />
            </div>
          </div>
          <Recommendations result={result} />
        </div>
        <div>
          <PDFExporter candidate={candidate} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;