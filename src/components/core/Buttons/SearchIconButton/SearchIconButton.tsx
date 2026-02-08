import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '../IconButton/IconButton';

export default function SearchIconButton({ onClick }: any) {
  return <IconButton onClick={onClick} icon={<SearchIcon />} tooltip={'Căutare'} />;
}
