
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Loader } from 'lucide-react';

type AuthFormButtonProps = {
  loading: boolean;
  label: string;
};

const AuthFormButton = ({ loading, label }: AuthFormButtonProps) => {
  return (
    <ButtonCustom
      type="submit"
      variant="magenta"
      className="w-full py-2"
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
          Processing...
        </span>
      ) : (
        label
      )}
    </ButtonCustom>
  );
};

export default AuthFormButton;
