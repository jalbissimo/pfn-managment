import Link from 'next/link';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PFN_GRADIENT =
  'linear-gradient(180deg,rgba(80, 208, 224, 1) 0%, rgba(48, 128, 176, 1) 42%, rgba(224, 144, 16, 0.96) 82%)';

const classes = {
  title: {
    color: 'transparent',
    userSelect: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '35px',
    pl: 2,
    backgroundImage: PFN_GRADIENT,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',

    WebkitTextFillColor: 'transparent'
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
