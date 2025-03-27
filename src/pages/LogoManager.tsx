
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SvgUploader from '@/components/common/SvgUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Check, Copy, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/Navbar';

const LogoManager = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Check for existing logo in local storage on component mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('site_logo_url');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    } else {
      // Try to fetch the most recent logo from storage
      fetchMostRecentLogo();
    }
  }, []);

  // Fetch the most recent logo uploaded by the user
  const fetchMostRecentLogo = async () => {
    try {
      const { data: filesData, error } = await supabase
        .storage
        .from('svg_files')
        .list('', {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw error;
      }

      // Find the most recent SVG file
      const svgFile = filesData.find(file => file.name.toLowerCase().endsWith('.svg'));
      
      if (svgFile) {
        const { data: { publicUrl } } = supabase
          .storage
          .from('svg_files')
          .getPublicUrl(svgFile.name);
        
        setLogoUrl(publicUrl);
        localStorage.setItem('site_logo_url', publicUrl);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
    localStorage.setItem('site_logo_url', url);
    toast({
      title: "Logo updated",
      description: "Your logo has been saved and will persist across sessions",
    });
  };

  const copyToClipboard = () => {
    if (logoUrl) {
      navigator.clipboard.writeText(logoUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "URL copied",
        description: "Logo URL has been copied to clipboard",
      });
    }
  };

  const useLogoAsSiteDefault = () => {
    if (logoUrl) {
      localStorage.setItem('site_logo_url', logoUrl);
      toast({
        title: "Default logo set",
        description: "This logo will now be used across your site",
        variant: "success",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">Logo Manager</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Upload & Manage Your Logo</CardTitle>
              <CardDescription>
                Upload your SVG logo to Supabase storage. Your logo will be stored securely and can be used throughout the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SvgUploader 
                onSuccess={handleLogoUpload}
                buttonText="Upload SVG Logo"
              />
              
              {logoUrl && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <Label>Current Logo</Label>
                    <div className="bg-slate-50 p-6 rounded-md flex justify-center items-center border">
                      <img 
                        src={logoUrl} 
                        alt="Your Logo" 
                        className="max-h-36 object-contain" 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="logoUrl" 
                          value={logoUrl} 
                          readOnly 
                          onClick={(e) => (e.target as HTMLInputElement).select()} 
                          className="flex-grow"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={copyToClipboard}
                          title="Copy URL"
                        >
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-2" 
                      onClick={useLogoAsSiteDefault}
                    >
                      <FileImage className="mr-2 h-4 w-4" />
                      Use as Site Logo
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How to use your logo:</h2>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Upload your SVG logo using the uploader above</li>
              <li>The logo will be stored in Supabase storage and persisted</li>
              <li>Click "Use as Site Logo" to set it as the default logo for your site</li>
              <li>Your logo will now appear in the navbar and other places throughout the site</li>
              <li>The logo URL is cached locally so it will persist between sessions</li>
            </ol>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LogoManager;
