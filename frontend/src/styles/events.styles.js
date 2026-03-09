import { alpha } from '@mui/material';

export const pageStyles = (theme) => ({
  root: {
    py: { xs: 1.5, sm: 2, md: 3 },
    px: { xs: 1, sm: 2, md: 3 },
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  header: {
    p: { xs: 1.5, sm: 2, md: 2.5 },
    mb: 2,
    borderRadius: { xs: 2, sm: 2.5 },
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    backdropFilter: 'blur(10px)',
    color: 'white',
  },
  headerContent: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: 1.5,
    mb: 2,
  },
  title: {
    fontWeight: 700,
    color: 'white',
    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
  },
  subtitle: {
    color: alpha(theme.palette.common.white, 0.9),
    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
    mt: 0.25,
  },
  addButton: {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.9),
    },
    px: { xs: 1.5, sm: 2 },
    py: { xs: 0.5, sm: 0.75 },
    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
    fontWeight: 600,
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)',
      sm: 'repeat(4, 1fr)',
    },
    gap: { xs: 1, sm: 1.5 },
  },
  statCard: {
    p: { xs: 1, sm: 1.5 },
    textAlign: 'center',
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.1)
      : alpha(theme.palette.common.white, 0.15),
    backdropFilter: 'blur(10px)',
    borderRadius: { xs: 1.5, sm: 2 },
    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.15)
        : alpha(theme.palette.common.white, 0.25),
      transform: 'translateY(-2px)',
    },
  },
  statNumber: {
    fontWeight: 700,
    color: 'white',
    lineHeight: 1.2,
    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
  },
  statLabel: {
    color: alpha(theme.palette.common.white, 0.9),
    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  tabsContainer: {
    borderRadius: { xs: 2, sm: 2.5 },
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    minHeight: { xs: 48, sm: 56 },
    '& .MuiTab-root': {
      minHeight: { xs: 48, sm: 56 },
      transition: 'all 0.2s ease',
    },
  },
  tabIndicator: {
    height: 3,
    borderRadius: '3px 3px 0 0',
    backgroundColor: theme.palette.primary.main,
  },
  tabContent: {
    p: { xs: 1.5, sm: 2, md: 2.5 },
    minHeight: { xs: 300, sm: 400 },
    backgroundColor: theme.palette.background.paper,
  },
});

export const StyledTab = (theme, isMobile) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
  minWidth: { xs: 48, sm: 100, md: 120 },
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '& .MuiTab-iconWrapper': {
    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.3rem' },
    marginBottom: isMobile ? 0.5 : 0,
    marginRight: isMobile ? 0 : 1,
  },
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
});