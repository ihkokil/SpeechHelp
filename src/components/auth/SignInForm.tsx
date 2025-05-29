
import LoginForm from './forms/LoginForm';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

const SignInForm: React.FC<SignInFormProps> = (props) => {
  return <LoginForm {...props} />;
};

export default SignInForm;
