
import { CreditCard, MoreVertical, Check, Trash, Star } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PaymentMethod } from './types';

export interface PaymentMethodItemProps {
  paymentMethod: PaymentMethod;
  onSetDefault: () => void;
  onDelete: () => void;
  canDelete: boolean;
  canSetDefault: boolean;
}

const PaymentMethodItem = ({ paymentMethod, onSetDefault, onDelete, canDelete, canSetDefault }: PaymentMethodItemProps) => {
  const getBrandIcon = (brand: string) => {
    return <CreditCard className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="flex items-center justify-between border rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 p-2 rounded-full">
          {getBrandIcon(paymentMethod.brand)}
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-medium">{paymentMethod.brand} •••• {paymentMethod.last4}</span>
            {paymentMethod.isDefault && (
              <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="mr-1 h-3 w-3" />
                Default
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
          </div>
          <div className="text-xs text-gray-400">
            {paymentMethod.cardHolder}
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          {canSetDefault && (
            <DropdownMenuItem className="cursor-pointer" onClick={onSetDefault}>
              <Star className="mr-2 h-4 w-4" />
              Set as Default
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={onDelete}
            disabled={!canDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PaymentMethodItem;
