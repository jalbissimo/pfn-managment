import React from 'react';
import MUIIconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface IconButtonProps {
  onClick?: any;
  tooltip?: string;
  id?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

/*
 * This component is used in order to render an IconButton component with tooltip and onClick functionality
 */
export default function IconButton(props: IconButtonProps) {
  const { onClick, tooltip, icon, disabled, id } = props;
  return (
    <Tooltip title={tooltip}>
      <div>
        <MUIIconButton onClick={onClick} disabled={disabled} id={id}>
          {icon}
        </MUIIconButton>
      </div>
    </Tooltip>
  );
}
