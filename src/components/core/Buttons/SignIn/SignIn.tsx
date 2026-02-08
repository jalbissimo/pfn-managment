import React from 'react';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface SignInProps {
  onClick: any;
}

//This component is used to display a button for user sign in
const SignIn = ({ onClick }: SignInProps) => {
  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<AccountCircle />}
      onClick={() => onClick()}
      name="SIGN_IN"
    >
      {'Autentificare'}
    </Button>
  );
};

export default SignIn;
