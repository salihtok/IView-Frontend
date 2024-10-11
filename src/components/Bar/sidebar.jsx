import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-200 p-4">
      <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
      <ul>
        <li className="mb-4">
          <Link
            to="/question-package"
            className="text-gray-700 hover:text-gray-900"
          >
            Manage Question Package
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/interview" className="text-gray-700 hover:text-gray-900">
            Interview List
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/questionsList"
            className="text-gray-700 hover:text-gray-900"
          >
            Question List
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;