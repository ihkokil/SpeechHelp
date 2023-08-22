
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PaymentMethod {
  type: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
  isDefault?: boolean;
}

interface PaymentMethodItemProps {
  method: PaymentMethod;
  onUpdateClick: () => void;
  onDeleteClick?: () => void;
  showDeleteButton?: boolean;
}

const PaymentMethodItem = ({ 
  method, 
  onUpdateClick, 
  onDeleteClick, 
  showDeleteButton = true 
}: PaymentMethodItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div className="flex items-center">
        <div className="h-10 w-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold mr-3">
          {method.brand}
        </div>
        <div>
          <p className="font-medium">•••• •••• •••• {method.last4}</p>
          <p className="text-sm text-gray-500">
            Expires {method.expiryMonth}/{method.expiryYear}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        {method.isDefault && (
          <Badge className="bg-pink-100 text-pink-800 border-pink-200 mr-2">Default</Badge>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onUpdateClick}
        >
          Update
        </Button>
        {showDeleteButton && !method.isDefault && onDeleteClick && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDeleteClick}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodItem;
