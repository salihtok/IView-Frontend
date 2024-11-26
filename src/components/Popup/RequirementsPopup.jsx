import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useInterviewStore from "../../store/interviewStore";

const RequirementsPopup = ({ interviewId, onClose, onUpdate }) => {
  const { interview, fetchInterviewById } = useInterviewStore();
  const [requirements, setRequirements] = useState({
    keywords: { technical: [], softSkills: [] },
    languageMetrics: { minWordCount: 0, targetDiversity: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Interview gereksinimlerini yükle
  useEffect(() => {
    const loadRequirements = async () => {
      setLoading(true);
      try {
        await fetchInterviewById(interviewId);
        if (interview?.requirements) {
          setRequirements(interview.requirements);
        }
      } catch (err) {
        toast.error("Failed to load requirements.");
      } finally {
        setLoading(false);
      }
    };
    loadRequirements();
  }, [fetchInterviewById, interviewId, interview]);

  const handleChange = (field, value, category = null) => {
    setRequirements((prev) => {
      if (category === "minWordCount" || category === "targetDiversity") {
        const numericValue =
          category === "targetDiversity" ? parseFloat(value) : parseInt(value);
        if (isNaN(numericValue)) return prev;
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [category]: numericValue,
          },
        };
      }

      if (category) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [category]:
              typeof value === "string"
                ? value.split(",").map((kw) => kw.trim())
                : [],
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async () => {
    try {
      await onUpdate(interviewId, { requirements });
      toast.success("Requirements updated successfully.");
      onClose();
    } catch (err) {
      toast.error("Failed to update requirements.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full relative shadow-lg">
          <p className="text-center">Loading requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Requirements</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Technical Keywords (comma-separated):
          </label>
          <input
            type="text"
            value={requirements.keywords.technical.join(", ")}
            onChange={(e) =>
              handleChange("keywords", e.target.value, "technical")
            }
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Soft Skills Keywords (comma-separated):
          </label>
          <input
            type="text"
            value={requirements.keywords.softSkills.join(", ")}
            onChange={(e) =>
              handleChange("keywords", e.target.value, "softSkills")
            }
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Minimum Word Count:
          </label>
          <input
            type="number"
            value={requirements.languageMetrics.minWordCount}
            onChange={(e) =>
              handleChange("languageMetrics", e.target.value, "minWordCount")
            }
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Target Diversity (0-1):
          </label>
          <input
            type="number"
            step="0.1"
            value={requirements.languageMetrics.targetDiversity}
            onChange={(e) =>
              handleChange("languageMetrics", e.target.value, "targetDiversity")
            }
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsPopup;