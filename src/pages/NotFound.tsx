
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link to="/" className="block w-full bg-[#b84c9f] text-white py-2 px-4 rounded hover:bg-[#a3428e] transition-all">
            Return to Home
          </Link>
          <Link to="/dashboard" className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-all">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
