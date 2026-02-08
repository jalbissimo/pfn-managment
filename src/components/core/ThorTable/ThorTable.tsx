import React from 'react';
import MaterialTable from '@material-table/core';
import {
  defaultComponents,
  defaultOptions,
  localization,
  ThorTableProps
} from './thor-table.props';

export default function ThorTable(props: ThorTableProps) {
  const { customComponents } = props;

  return (
    <MaterialTable
      options={{ ...defaultOptions }}
      components={{ ...defaultComponents, ...customComponents }}
      localization={localization}
      {...props}
    />
  );
}
