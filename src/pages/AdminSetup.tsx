
import CreateFirstAdmin from '@/components/admin/CreateFirstAdmin';

const AdminSetup = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-900 to-pink-800 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src="/Speech Help - Logo-New.png" 
            alt="SpeechHelp Logo" 
            className="h-16"
          />
        </div>
        <CreateFirstAdmin />
      </div>
    </div>
  );
};

export default AdminSetup;
