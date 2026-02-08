import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '../IconButton/IconButton';

export default function CloseIconButton({ onClick }: any) {
  return (
    <IconButton onClick={onClick} icon={<CloseIcon />} tooltip={'Închide'} id="close-button" />
  );
}
