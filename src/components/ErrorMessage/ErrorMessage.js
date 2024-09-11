import './ErrorMessage.css';

const ErrorMessage = ({ error }) => {
  return <div className="error-bar">{error}</div>;
};

export default ErrorMessage;
