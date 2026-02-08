import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import ActionButtons from '../Buttons/ActionButtons/ActionButtons';
import CloseIconButton from '../Buttons/CloseIconButton/CloseIconButton';
import { JSX } from 'react';

interface ModalProps {
  onClose?: any;
  title?: string;
  children: JSX.Element;
  actions?: any;
  width?: 'lg' | 'xs' | 'sm' | 'md' | 'xl';
  minWidth?: string;
  open: boolean;
}

const classes = {
  box: { display: 'flex' },
  children: { flexGrow: 1 },
  actions: { padding: 2 }
};

const ModalTitle = (props: any) => {
  const { children, onClose } = props;

  return (
    <DialogTitle component="div">
      <Box sx={classes.box}>
        <Box sx={classes.children}>{children}</Box>
        <CloseIconButton onClick={onClose} />
      </Box>
    </DialogTitle>
  );
};

const ModalFooter = ({ actions }: { actions: any }) => (
  <DialogActions sx={classes.actions}>
    <ActionButtons actions={actions} />
  </DialogActions>
);

export default function Modal(props: ModalProps) {
  const { onClose, title, children, actions, open, width = 'lg', minWidth } = props;
  return (
    <Dialog open={open} maxWidth={width}>
      <ModalTitle onClose={onClose}>{title}</ModalTitle>
      <DialogContent sx={{ minWidth }} dividers>
        {children}
      </DialogContent>
      {actions && <ModalFooter actions={actions} />}
    </Dialog>
  );
}
