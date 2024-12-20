
import SignUpFormComponent from './forms/SignUpForm';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSwitchToForgotPassword: () => void;
  autoFocus?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  return <SignUpFormComponent {...props} />;
};

export default SignUpForm;
