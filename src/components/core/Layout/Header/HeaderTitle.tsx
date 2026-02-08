import Link from 'next/link';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const classes = {
  title: {
    color: 'secondary.main',
    userSelect: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '35px',
    pl: 2
  },
  logoContainer: {
    display: 'flex',
    minWidth: '200px',
 
    '&:hover': {
      cursor: 'pointer'
    }
  }
};

export default function HeaderTitle() {
  return (
    <Link href={'/'} style={{ textDecoration: 'none' }}>
      <Box sx={classes.logoContainer}>
        <Image src="/logo.png" alt="PFN" width={28} height={28} priority />
        <Typography variant="h6" sx={classes.title}>
          PFN Fixture Management Tool
        </Typography>
      </Box>
    </Link>
  );
}
