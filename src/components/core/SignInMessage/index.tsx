import React from 'react';
import Alert from '@mui/material/Alert';

export default function SignInMessage() {
  return (
    <Alert severity="warning">
      Bine ați venit în PFN Fixture Management Tool!Pentru a vedea conținutul acestei aplicații
      trebuie să vă autentificați!
    </Alert>
  );
}
