
import { Button } from '@/components/ui/button';

const DangerZone = () => {
  return (
    <>
      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
      <div className="p-4 border border-red-200 rounded-md flex justify-between items-center">
        <div>
          <h4 className="font-medium text-red-600">Delete Account</h4>
          <p className="text-sm text-gray-600 mt-1">
            Permanently delete your account and all of your content. This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end">
          <Button variant="destructive" className="w-40 h-10 bg-red-600 hover:bg-red-700">
            Delete Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default DangerZone;
