import React from 'react';
import Edit from '@mui/icons-material/Edit';
import IconButton from '../IconButton/IconButton';

export default function EditIconButton({ onClick }: any) {
  return <IconButton onClick={onClick} icon={<Edit />} tooltip={'Editare'} />;
}
