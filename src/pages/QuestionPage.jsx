import { useEffect, useState } from "react";
import useQuestionsStore from "../store/questionStore";
import AddQuestionPopup from "../components/Popup/addQuestion";
import Sidebar from "../components/Bar/sidebar";
import SearchBar from "../components/Bar/SearchBar";
import AddButton from "../components/Buttons/AddButton";
import EditButton from "../components/Buttons/EditButton";
import DeleteButton from "../components/Buttons/DeleteButton";
import LogoutButton from "../components/Buttons/LogoutButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    toast.success("Question deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question); // Set selected question for updating
    setIsPopupOpen(true); // Open popup
    toast.info("Editing question...", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  };

  // Filter questions based on search query
  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar - fixed position on mobile, sticky on desktop */}
      <div className="flex h-screen md:sticky md:top-0 md:h-screen">
        <Sidebar />
      </div>

      {/* Main content - scrollable */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="p-4 md:p-6">
          <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
            {/* Header Section */}
            <div className="sticky top-0 bg-white z-10 mb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-bold">Question List</h2>
                <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                  <div className="flex-grow">
                    <SearchBar
                      searchTerm={searchQuery}
                      setSearchTerm={setSearchQuery}
                      placeholder="Search questions..."
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <AddButton
                      onClick={() => setIsPopupOpen(true)}
                      id="addQuestionBtn"
                    />
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && <p className="text-center py-4">Loading...</p>}
            {error && <p className="text-center text-red-500 py-4">{error}</p>}
            {!loading && filteredQuestions.length === 0 && (
              <p className="text-center py-4">No questions found matching your search.</p>
            )}

            {/* Table Container */}
            <div className="w-full">
              <table className="w-full table-fixed divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th scope="col" className="w-16 py-3 px-4 text-left text-sm font-semibold text-gray-600">Order</th>
                    <th scope="col" className="w-[60%] py-3 px-4 text-left text-sm font-semibold text-gray-600">Question</th>
                    <th scope="col" className="w-32 py-3 px-4 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th scope="col" className="w-32 py-3 px-4 text-left text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredQuestions.map((question, index) => (
                    <tr key={question._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{index + 1}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="break-words">{question.text}</div>
                      </td>
                      <td className="py-3 px-4 text-sm whitespace-nowrap">
                        {question.questionTime.minutes} min {question.questionTime.seconds} sec
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <EditButton onClick={() => handleEdit(question)} />
                          <DeleteButton onClick={() => handleDelete(question._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Popup remains the same */}
      {isPopupOpen && (
        <AddQuestionPopup
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedQuestion(null);
            if (selectedQuestion) {
              toast.success("Question updated successfully!", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
              });
            } else {
              toast.success("Question added successfully!", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
              });
            }
          }}
          selectedQuestion={selectedQuestion}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default QuestionPage;
