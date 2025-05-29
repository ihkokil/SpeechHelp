
import ForgotPasswordFormComponent from './forms/ForgotPasswordForm';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = (props) => {
  return <ForgotPasswordFormComponent {...props} />;
};

export default ForgotPasswordForm;
