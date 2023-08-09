
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ContactSalesSection: React.FC = () => {
  return (
    <div className="mt-16 max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
      <p className="text-gray-600 mb-6">
        We offer custom enterprise plans for teams and organizations.
        Contact us to discuss your specific needs.
      </p>
      <Link to="/#contact">
        <Button 
          variant="outline" 
          className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
        >
          Contact Sales
        </Button>
      </Link>
    </div>
  );
};

export default ContactSalesSection;
