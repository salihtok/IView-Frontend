export const QuestionPackage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4">
        <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
        <ul>
          <li className="mb-4">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Manage Question Package
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Interview List
            </a>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              id="packageTitle"
              placeholder="Package Title..."
              className="p-2 border border-gray-300 rounded w-1/2"
            />
            <button
              id="addQuestionBtn"
              className="bg-gray-500 text-white p-2 rounded"
            >
              +
            </button>
          </div>

          {/* Question List */}
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
                {/* Dynamic Questions will be appended here */}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button className="bg-gray-400 text-white p-2 rounded mr-4">
              Cancel
            </button>
            <button id="saveBtn" className="bg-blue-500 text-white p-2 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPackage;