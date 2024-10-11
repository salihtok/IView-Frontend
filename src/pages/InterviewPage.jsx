import Sidebar from "../components/Bar/sidebar";

export const InterviewList = () => {
  const interviewData = [
    { title: "Backend Interview", total: 6, onHold: 3, published: true },
    { title: "Frontend Interview", total: 6, onHold: 2, published: false },
    { title: "Fullstack Interview", total: 10, onHold: 2, published: false },
    { title: "Devops Interview", total: 100, onHold: 0, published: false },
    { title: "Backend Interview", total: 6, onHold: 2, published: true },
    { title: "Backend Interview", total: 6, onHold: 2, published: true },
    { title: "Backend Interview", total: 6, onHold: 2, published: true },
    { title: "Backend Interview", total: 6, onHold: 2, published: true },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-6 bg-gray-100">
        <h2 className="text-xl font-bold mb-6">Interview List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {interviewData.map((interview, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between"
            >
              {/* Copy Link and Title */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">
                  {interview.title}
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-link"></i> Copy Link
                </button>
              </div>

              {/* Candidates Info */}
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span>Total: {interview.total}</span>
                  <span>On Hold: {interview.onHold}</span>
                </div>
              </div>

              {/* Published / Unpublished and Action */}
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    interview.published ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {interview.published ? "Published" : "Unpublished"}
                </span>
                <button className="text-blue-500 hover:underline">
                  See Videos
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewList;
