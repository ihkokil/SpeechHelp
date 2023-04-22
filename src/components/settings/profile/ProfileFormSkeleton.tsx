
import { Card, CardContent } from '@/components/ui/card';

const ProfileFormSkeleton = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileFormSkeleton;
