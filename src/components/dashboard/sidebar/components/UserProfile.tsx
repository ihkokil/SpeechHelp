
export const UserProfile = () => {
  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 font-medium">U</span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">Guest User</p>
          <p className="text-xs text-gray-500">guest@example.com</p>
        </div>
      </div>
    </div>
  );
};
