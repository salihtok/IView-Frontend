import { useEffect, useState } from "react";
import useQuestionsStore from "../store/questionStore";
import AddQuestionPopup from "../components/Popup/addQuestion";
import Sidebar from "../components/Bar/sidebar";

const QuestionPage = () => {
  const { questions, loading, error, fetchQuestions, deleteQuestion } =
    useQuestionsStore();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Selected question for editing
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuestions(); // Fetch questions on component mount
  }, [fetchQuestions]);

  const handleDelete = (id) => {
    deleteQuestion(id); // Delete question
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question); // Set selected question for updating
    setIsPopupOpen(true); // Open popup
  };

  // Filter questions based on search query
  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mb-6">Question List</h2>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              <button
                id="addQuestionBtn"
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setIsPopupOpen(true)}
              >
                +
              </button>
            </div>
          </div>

          {/* Question List */}
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && filteredQuestions.length === 0 && (
            <p>No questions found matching your search.</p>
          )}

          <div className="overflow-hidden border border-gray-300 rounded">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full bg-gray-200 text-left text-gray-600">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Question</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody id="questionList">
                {filteredQuestions.map((question, index) => (
                  <tr key={question._id}>
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{question.text}</td>
                    <td className="py-3 px-4">
                      {question.questionTime.minutes} min{" "}
                      {question.questionTime.seconds} sec
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(question)}
                        className="bg-yellow-500 text-white p-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <AddQuestionPopup
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedQuestion(null); // Reset selected question when popup closes
          }}
          selectedQuestion={selectedQuestion} // Pass selected question info for update
        />
      )}
    </div>
  );
};

export default QuestionPage;
