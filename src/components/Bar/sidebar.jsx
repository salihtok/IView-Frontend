// src/components/Bar/Sidebar.js
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <hr className="my-4 border-gray-300" />
      <div>
        <ul>
          <li className="mb-4">
            <Link to="/interview" className="text-gray-700 hover:text-gray-900">
              Interview List
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/question-package"
              className="text-gray-700 hover:text-gray-900"
            >
              Manage Question Package
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
      </div>
    </aside>
  );
};

export default Sidebar;