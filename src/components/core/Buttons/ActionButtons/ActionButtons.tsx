import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

export type Action = {
  permission: string;
  name: string;
  title: string;
  loading?: boolean;
  tooltip?: string;
  color?: 'secondary' | 'primary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'text' | 'outlined' | 'contained';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
};

type ActionButtonsProps = {
  actions: Action[];
};

/*
 * This component is used to display the form action buttons
 */
export default function ActionButtons({ actions }: ActionButtonsProps) {
  return (
    <Stack direction="row" spacing={1}>
      {actions?.map((action, idx) => (
        // <Protected key={idx} permission={action.permission}>
        <Tooltip key={idx} title={action.disabled ? '' : action.tooltip}>
          <LoadingButton
            size="small"
            key={idx}
            startIcon={action.startIcon}
            endIcon={action.endIcon}
            color={action.color ?? 'secondary'}
            variant={action.variant}
            name={action.name}
            loading={action.loading}
            disabled={action.disabled}
            onClick={action.disabled ? undefined : action.onClick}
          >
            {action.title}
          </LoadingButton>
        </Tooltip>
        // </Protected>
      ))}
    </Stack>
  );
}
