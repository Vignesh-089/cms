import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Edit,
  Delete,
  Refresh,
  CalendarToday,
  Person,
  Warning,
  LocationOn,
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const DeathAnniversaryTab = ({ events, onEdit, onDelete, onRecalculate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const calculateDaysRemaining = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    return differenceInDays(eventDate, today);
  };

  const getPanchangStatus = (event) => {
    if (!event.death_tithi || !event.death_paksha) {
      return { color: 'error', label: 'Incomplete', icon: '⚠️' };
    }
    return { color: 'success', label: 'Complete', icon: '✅' };
  };

  const getDayStatus = (days) => {
    if (days > 0) return { label: 'Days Left', color: 'warning' };
    if (days < 0) return { label: 'Days Ago', color: 'default' };
    return { label: 'Today', color: 'success' };
  };

  const getUrgencyColor = (days) => {
    if (days <= 3 && days > 0) return theme.palette.error.main;
    if (days <= 7 && days > 0) return theme.palette.warning.main;
    if (days > 7) return theme.palette.success.main;
    if (days < 0) return theme.palette.grey[500];
    return theme.palette.success.main;
  };

  const getUrgencyGradient = (days) => {
    if (days > 0 && days <= 3) {
      return `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.light, 0.05)} 100%)`;
    }
    if (days > 0 && days <= 7) {
      return `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`;
    }
    if (days > 7) {
      return `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`;
    }
    if (days < 0) {
      return `linear-gradient(135deg, ${alpha(theme.palette.grey[500], 0.08)} 0%, ${alpha(theme.palette.grey[400], 0.08)} 100%)`;
    }
    return `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.light, 0.08)} 100%)`;
  };

  const styles = {
    card: {
      height: '100%', // Changed from fixed height to auto
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2.5,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      width: '100%',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
      },
    },
    cardContent: {
      p: isMobile ? 1.5 : 2,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 1,
    },
    titleSection: {
      display: 'flex',
      gap: 1,
      minWidth: 0,
      flex: 1,
    },
    iconWrapper: {
      width: isMobile ? 40 : 48,
      height: isMobile ? 40 : 48,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)} 0%, ${alpha(theme.palette.error.light, 0.05)} 100%)`,
      color: theme.palette.error.main,
      flexShrink: 0,
    },
    icon: {
      fontSize: isMobile ? 20 : 24,
    },
    titleWrapper: {
      minWidth: 0,
      flex: 1,
    },
    title: {
      fontWeight: 600,
      fontSize: isMobile ? '1rem' : '1.1rem',
      color: theme.palette.text.primary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      mb: 0.25,
    },
    subtitle: {
      fontSize: '0.7rem',
      color: theme.palette.text.secondary,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    },
    statusChip: {
      height: 24,
      flexShrink: 0,
      '& .MuiChip-label': {
        px: 1,
        fontSize: '0.65rem',
        fontWeight: 600,
      },
    },
    infoBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
    },
    infoIcon: {
      fontSize: isMobile ? 18 : 20,
      color: theme.palette.text.secondary,
      flexShrink: 0,
    },
    infoText: {
      fontSize: isMobile ? '0.8rem' : '0.85rem',
      color: theme.palette.text.primary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    infoTextBold: {
      fontSize: isMobile ? '0.8rem' : '0.85rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    daysBanner: (days) => ({
      background: getUrgencyGradient(days),
      borderRadius: 2,
      p: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: `2px solid ${alpha(getUrgencyColor(days), 0.3)}`,
    }),
    daysContent: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 0.5,
    },
    daysNumber: {
      fontSize: isMobile ? '1.75rem' : '2rem',
      fontWeight: 700,
      color: (days) => getUrgencyColor(days),
      lineHeight: 1,
    },
    daysUnit: {
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
    daysLabel: {
      fontSize: isMobile ? '0.7rem' : '0.75rem',
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600,
    },
    // Panchang Section
    panchangSection: {
      background: theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.dark, 0.1)
        : alpha(theme.palette.primary.light, 0.1),
      borderRadius: 2,
      p: 1.5,
      border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    },
    panchangTitle: {
      fontSize: isMobile ? '0.75rem' : '0.8rem',
      fontWeight: 700,
      color: theme.palette.primary.main,
      mb: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    },
    // Mobile column layout with headers and values on separate lines
    panchangColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    },
    panchangItemWrapper: {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.3)
        : alpha(theme.palette.background.paper, 0.6),
      borderRadius: 1.5,
      p: 1.5,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    },
    panchangItemHeader: {
      fontSize: '0.7rem',
      color: theme.palette.text.secondary,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    panchangItemValue: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: theme.palette.primary.main,
      lineHeight: 1.4,
    },
    // Desktop grid layout
    panchangGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
    },
    panchangItem: {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.3)
        : alpha(theme.palette.background.paper, 0.6),
      borderRadius: 1.5,
      p: 1.5,
      textAlign: 'center',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    },
    panchangItemLabel: {
      fontSize: '0.7rem',
      color: theme.palette.text.secondary,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    panchangItemValue: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: theme.palette.primary.main,
      lineHeight: 1.3,
    },
    actions: {
      p: isMobile ? 1 : 1.5,
      pt: isMobile ? 1 : 1.5,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 1,
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
    },
    actionButtons: {
      display: 'flex',
      gap: 0.5,
      width: isMobile ? '100%' : 'auto',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: isMobile ? 1 : 'none',
      minWidth: isMobile ? 0 : 60,
      height: 36,
      textTransform: 'none',
      fontSize: '0.8rem',
      fontWeight: 500,
      color: theme.palette.text.secondary,
      border: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        border: `1px solid ${alpha(theme.palette.text.secondary, 0.3)}`,
      },
    },
    deleteButton: {
      flex: isMobile ? 1 : 'none',
      minWidth: isMobile ? 0 : 60,
      height: 36,
      textTransform: 'none',
      fontSize: '0.8rem',
      fontWeight: 500,
      color: theme.palette.error.main,
      border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
      '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
      },
    },
    recalculateButton: {
      width: isMobile ? '100%' : 'auto',
      height: 36,
      textTransform: 'none',
      fontSize: '0.8rem',
      fontWeight: 500,
      color: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
      },
    },
    emptyState: {
      textAlign: 'center',
      py: 8,
      px: 3,
      bgcolor: theme.palette.background.paper,
      borderRadius: 3,
      border: `2px dashed ${alpha(theme.palette.error.main, 0.3)}`,
    },
    emptyIcon: {
      fontSize: isMobile ? 48 : 64,
      color: alpha(theme.palette.error.main, 0.3),
      mb: 2,
    },
    emptyTitle: {
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
      mb: 1,
    },
    emptyText: {
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      color: theme.palette.text.secondary,
    },
  };

  return (
    <Box sx={{ px: isMobile ? 1 : 0 }}>
      <AnimatePresence>
        <Grid container spacing={isMobile ? 1.5 : 3}>
          {events.map((event, index) => {
            const daysRemaining = calculateDaysRemaining(event.date);
            const panchangStatus = getPanchangStatus(event);
            const dayStatus = getDayStatus(daysRemaining);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  style={{ height: '100%' }}
                >
                  <Card sx={styles.card}>
                    <CardContent sx={styles.cardContent}>
                      {/* Header */}
                      <Box sx={styles.header}>
                        <Box sx={styles.titleSection}>
                          <Box sx={styles.iconWrapper}>
                            <Warning sx={styles.icon} />
                          </Box>
                          <Box sx={styles.titleWrapper}>
                            <Typography sx={styles.title}>
                              {event.name}
                            </Typography>
                            <Typography sx={styles.subtitle}>
                              <span>🕯️</span> Death Anniversary
                            </Typography>
                          </Box>
                        </Box>
                        <Tooltip title={`Panchang: ${panchangStatus.label}`}>
                          <Chip
                            icon={<span style={{ fontSize: '0.8rem' }}>{panchangStatus.icon}</span>}
                            label={!isMobile ? panchangStatus.label : ''}
                            color={panchangStatus.color}
                            size="small"
                            sx={styles.statusChip}
                          />
                        </Tooltip>
                      </Box>

                      {/* Client & Date */}
                      <Box sx={styles.infoBox}>
                        <Box sx={styles.infoItem}>
                          <Person sx={styles.infoIcon} />
                          <Typography sx={styles.infoTextBold} noWrap>
                            {event.client}
                          </Typography>
                        </Box>
                        <Box sx={styles.infoItem}>
                          <CalendarToday sx={styles.infoIcon} />
                          <Typography sx={styles.infoText} noWrap>
                            {format(new Date(event.date), 'dd MMMM yyyy')}
                          </Typography>
                        </Box>
                        {event.location && (
                          <Box sx={styles.infoItem}>
                            <LocationOn sx={styles.infoIcon} />
                            <Typography sx={styles.infoText} noWrap>
                              {event.location}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Panchang Details */}
                      <Box sx={styles.panchangSection}>
                        <Typography sx={styles.panchangTitle}>
                          <span>🕯️</span> Panchang Details
                        </Typography>
                        
                        {/* Mobile Column Layout */}
                        {isMobile ? (
                          <Box sx={styles.panchangColumn}>
                            {/* Tithi */}
                            <Box sx={styles.panchangItemWrapper}>
                              <Typography sx={styles.panchangItemHeader}>
                                Tithi
                              </Typography>
                              <Typography sx={styles.panchangItemValue}>
                                {event.death_tithi || '—'}
                              </Typography>
                            </Box>

                            {/* Paksha */}
                            <Box sx={styles.panchangItemWrapper}>
                              <Typography sx={styles.panchangItemHeader}>
                                Paksha
                              </Typography>
                              <Typography sx={styles.panchangItemValue}>
                                {event.death_paksha || '—'}
                              </Typography>
                            </Box>

                            {/* Next Date */}
                            <Box sx={styles.panchangItemWrapper}>
                              <Typography sx={styles.panchangItemHeader}>
                                Next Date
                              </Typography>
                              <Typography sx={styles.panchangItemValue}>
                                {event.calculated_anniversary_date
                                  ? format(new Date(event.calculated_anniversary_date), 'dd MMM')
                                  : '—'}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          /* Desktop Grid Layout */
                          <Box sx={styles.panchangGrid}>
                            {/* Tithi */}
                            <Box sx={styles.panchangItem}>
                              <Typography sx={styles.panchangItemLabel}>
                                Tithi
                              </Typography>
                              <Typography sx={styles.panchangItemValue}>
                                {event.death_tithi || '—'}
                              </Typography>
                            </Box>

                            {/* Paksha */}
                            <Box sx={styles.panchangItem}>
                              <Typography sx={styles.panchangItemLabel}>
                                Paksha
                              </Typography>
                              <Typography sx={styles.panchangItemValue}>
                                {event.death_paksha || '—'}
                              </Typography>
                            </Box>

                            {/* Next Date */}
                            <Box sx={styles.panchangItem}>
                              <Typography sx={styles.panchangItemLabel}>
                                Next Date
                              </Typography>
                              <Typography sx={styles.panchangItemValue}>
                                {event.calculated_anniversary_date
                                  ? format(new Date(event.calculated_anniversary_date), 'dd MMM yyyy')
                                  : '—'}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={styles.actions}>
                      <Box sx={styles.actionButtons}>
                        <Tooltip title="Edit">
                          <Button
                            size="small"
                            onClick={() => onEdit(event)}
                            startIcon={<Edit sx={{ fontSize: 16 }} />}
                            sx={styles.actionButton}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            size="small"
                            onClick={() => onDelete(event.id)}
                            startIcon={<Delete sx={{ fontSize: 16 }} />}
                            sx={styles.deleteButton}
                          >
                            Delete
                          </Button>
                        </Tooltip>
                      </Box>
                      <Tooltip title="Recalculate Next Date">
                        <Button
                          size="small"
                          onClick={() => onRecalculate(event.id)}
                          startIcon={<Refresh sx={{ fontSize: 16 }} />}
                          sx={styles.recalculateButton}
                        >
                          Recalculate
                        </Button>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </AnimatePresence>

      {/* Empty State */}
      {events.length === 0 && (
        <Box sx={styles.emptyState}>
          <Warning sx={styles.emptyIcon} />
          <Typography sx={styles.emptyTitle}>
            No Death Anniversaries
          </Typography>
          <Typography sx={styles.emptyText}>
            Add a death anniversary with Panchang details to get started
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DeathAnniversaryTab;