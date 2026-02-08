export function triggerMaterialTableAddRow(tableRef: any) {
  const table = tableRef?.current;
  if (!table?.dataManager) return;
  if (table.state?.showAddRow) return;
  if (table.dataManager.lastEditingRow) return;

  table.dataManager.changeRowEditing();
  table.setState({
    ...table.dataManager.getRenderState(),
    showAddRow: true
  });
}
