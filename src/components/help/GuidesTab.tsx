
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Video } from 'lucide-react';

const GuidesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Guides & Tutorials</CardTitle>
        <CardDescription>Step-by-step guides to help you get the most out of Speech Help</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Getting Started Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Learn the basics of creating your first speech</p>
              <Button variant="magenta" className="w-full flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Read Guide
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Speech Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Professional tips to enhance your speech writing</p>
              <Button variant="magenta" className="w-full flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Tips
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Video Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Watch helpful videos explaining our features</p>
              <Button variant="magenta" className="w-full flex items-center gap-2">
                <Video className="h-4 w-4" />
                Watch Videos
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Account Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Learn how to manage your account settings</p>
              <Button variant="magenta" className="w-full flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Read Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidesTab;
