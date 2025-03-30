
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ContactSalesSection: React.FC = () => {
  const navigate = useNavigate();
  
  const handleContactClick = () => {
    // Store the target section in sessionStorage before navigation
    sessionStorage.setItem('scrollTarget', 'contact');
    navigate('/');
  };

  return (
    <div className="mt-16 max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
      <p className="text-gray-600 mb-6">
        We offer custom enterprise plans for teams and organizations.
        Contact us to discuss your specific needs.
      </p>
      <Button 
        variant="outline" 
        className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
        onClick={handleContactClick}
      >
        Contact Sales
      </Button>
    </div>
  );
};

export default ContactSalesSection;
