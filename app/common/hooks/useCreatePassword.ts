import { useState } from 'react';

const useCreatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordError, setPasswordErrorDisplay] = useState(false);
  const [showConfirmPasswordError, setConfirmPasswordErrorDisplay] = useState(false);

  const onPasswordBlur = () => {
    if (password.length < 8) {
      setPasswordErrorDisplay(true);
      return;
    }
    setPasswordErrorDisplay(false);
  };

  const onConfirmPasswordBlur = () => {
    if (password !== confirmPassword && !showConfirmPasswordError) {
      setConfirmPasswordErrorDisplay(true);
    }
    if (password === confirmPassword && showConfirmPasswordError) {
      setConfirmPasswordErrorDisplay(false);
    }
  };

  return {
    password, setPassword, confirmPassword, setConfirmPassword, showPasswordError,
    showConfirmPasswordError, onPasswordBlur, onConfirmPasswordBlur
  };
};

export default useCreatePassword;
