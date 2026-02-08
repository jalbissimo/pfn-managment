import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ThorTableEditField from './ThorTableEditField';

export interface ThorTableProps {
  title?: any;
  data: any;
  columns: any;
  actions?: any;
  options?: any;
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  editable?: any;
  tableRef?: any;
  detailPanel?: any;
  renderSummaryRow?: any;
  onPageChange?: (page: number, pageSize: number) => void;
  onRowsPerPageChange?: (pageSize: number) => void;
  onOrderChange?: (orderBy: number, orderDirection: 'desc' | 'asc') => void;
  onRowClick?: (event?: any, rowData?: any) => void;
  onSelectionChange?: (rows: any) => void;
  customComponents?: any;
  parentChildData?: (row: any, rows: any) => any;
}

export const defaultOptions: any = {
  filtering: false,
  maxColumnSort: 0,
  draggable: false,
  paging: false,
  pageSizeOptions: [5, 10],
  emptyRowsWhenPaging: false,
  actionsColumnIndex: -1,
  actionsCellStyle: { paddingLeft: 21.5 },
  search: true,
  headerStyle: {
    fontSize: '13px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'rgba(0, 0, 0, 0.8)',
    position: 'sticky',
    padding: '8px 16px',
    zIndex: 1
  },
  cellStyle: {
    fontSize: '13px'
  },
  searchFieldStyle: {
    border: '0px'
  }
};

export const localization = {
  body: {
    emptyDataSourceMessage: 'Nu există înregistrări de afișat.',
    addTooltip: 'Adaugă',
    editTooltip: 'Editează',
    deleteTooltip: 'Șterge',
    editRow: {
      saveTooltip: 'Salvează',
      cancelTooltip: 'Anulare',
      deleteText: 'Ești sigur că vrei să ștergi această înregistrare?'
    }
  },
  toolbar: {
    searchPlaceholder: 'Caută...',
    searchTooltip: 'Căutare'
  },
  pagination: {
    labelRowsPerPage: 'Rânduri pe pagină',
    previousTooltip: 'Pagina anterioară',
    firstTooltip: 'Prima pagină',
    nextTooltip: 'Pagina următoare',
    lastTooltip: 'Ultima pagină'
  },
  header: {
    actions: 'Acțiuni'
  }
};

const Container = styled(Paper)({
  boxShadow: 'none'
});

export const defaultComponents = {
  Container: Container,
  EditField: ThorTableEditField
};
