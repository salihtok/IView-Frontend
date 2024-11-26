import React, { useState } from "react";

import { Radar, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Gerekli elemanları kaydet
ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const RadarChart = ({ data }) => {
  if (!data) return <div>No Data Available</div>;

  const chartData = {
    labels: ["Technical Skills", "Soft Skills", "Total Score"],
    datasets: [
      {
        label: "Candidate Analysis",
        data: [
          data.keyword_hits?.technical?.length || 0,
          data.keyword_hits?.soft_skills?.length || 0,
          data.total_score || 0,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={chartData} />;
};

export const BarChart = ({ data }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (!data || data.length === 0) return <div>No Data Available</div>;

  const chartData = {
    labels: data.map((_, index) => `Q${index + 1}`), // Soru numaralarını gösterir
    datasets: [
      {
        label: "Question Similarity",
        data: data.map((q) => q.similarity || 0),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} />
      <div className="mt-4">
        {data.map((q, index) => (
          <div key={index} className="mb-2">
            <button
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={() =>
                setExpandedQuestion(expandedQuestion === index ? null : index)
              }
            >
              {expandedQuestion === index
                ? `Hide Question Q${index + 1}`
                : `Show Question Q${index + 1}`}
            </button>
            {expandedQuestion === index && (
              <p className="text-gray-700 mt-1">{q.question}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PieChart = ({ data }) => {
  if (!data) return <div>No Data Available</div>;

  const positive = data.positive || 0;
  const neutral = data.neutral || 0;
  const negative = data.negative || 0;

  const total = positive + neutral + negative;

  if (total === 0) {
    return <div>No Data Available</div>;
  }

  const chartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: "Emotion Distribution",
        data: [positive, neutral, negative],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};
