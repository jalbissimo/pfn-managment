import React from 'react';
import Done from '@mui/icons-material/Done';
import IconButton from '../IconButton/IconButton';

export default function ApproveIconButton({ onClick }: any) {
  return <IconButton onClick={onClick} icon={<Done />} tooltip={'Salvare'} />;
}
