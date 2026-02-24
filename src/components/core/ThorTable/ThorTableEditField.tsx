import React, { ComponentType } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { formatDate } from '@utils/date';

type Value = number | string | boolean;

type ThorTableEditFieldProps = ComponentType & {
  columnDef: {
    custom?: 'text' | 'checkbox' | 'select' | 'date';
    lookup?: { [key: string]: string };
    autoFocus?: boolean;
  };
  value: Value;
  onChange: (value: Value) => void;
  helperText?: string;
  error?: boolean;
};

export default function ThorTableEditField(props: ThorTableEditFieldProps) {
  const { columnDef } = props;
  const { custom, autoFocus } = columnDef;

  switch (custom) {
    case 'checkbox': {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Checkbox
            checked={(props.value as boolean) || false}
            onChange={(_, checked) => props.onChange(checked)}
          />
        </Box>
      );
    }

    case 'date': {
      return (
        <TextField
          autoFocus={autoFocus}
          fullWidth
          type="date"
          value={formatDate(props.value as string)}
          onChange={(e) => props.onChange(e.target.value)}
          error={props.error}
          helperText={props.helperText}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />
      );
    }
    case 'select': {
      const { lookup } = columnDef;

      if (lookup) {
        return (
          <TextField
            autoFocus={autoFocus}
            select
            fullWidth
            value={props.value || ''}
            onChange={(e) => props.onChange(e.target.value)}
            error={props.error}
            helperText={props.helperText}
          >
            {Object.entries(lookup).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        );
      }

      console.error('`lookup` property should be filled', lookup);
    }
  }

  return (
    <TextField
      autoFocus={autoFocus}
      fullWidth
      value={props.value || ''}
      onChange={(e) => props.onChange(e.target.value)}
      error={props.error}
      helperText={props.helperText}
    />
  );
}
