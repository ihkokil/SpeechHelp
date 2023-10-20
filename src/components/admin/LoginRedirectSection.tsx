
import { Link } from 'react-router-dom';

const LoginRedirectSection = () => {
  return (
    <div className="text-center py-2">
      <p className="text-sm text-gray-600 mb-4">An admin account already exists. You can log in or reset all admin accounts below.</p>
      <Link 
        to="/admin/login" 
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white rounded-md mb-4"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default LoginRedirectSection;
