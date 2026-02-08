import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ActionButtons from '@components/core/Buttons/ActionButtons';

export default function ActionHeader({ title, actions }: { title: string; actions: any }) {
  return (
    <Stack
      direction="row"
      pb={2}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}
    >
      <Typography variant="h6" style={{ alignSelf: 'center' }}>
        {title}
      </Typography>
      <ActionButtons actions={actions} />
    </Stack>
  );
}
