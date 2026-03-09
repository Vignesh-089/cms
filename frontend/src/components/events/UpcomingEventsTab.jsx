import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Divider,
} from '@mui/material';
import {
  Event,
  Warning,
  Celebration,
  Church,
  Home,
  NotificationsActive,
} from '@mui/icons-material';
import { format, differenceInDays, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const UpcomingEventsTab = ({ events, onEdit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getUpcomingEvents = () => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);

    return events
      .map(event => ({
        ...event,
        daysUntil: differenceInDays(new Date(event.date), today),
        eventDate: new Date(event.date),
      }))
      .filter(event => event.daysUntil >= 0 && event.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const getEventIcon = (type) => {
    const icons = {
      wedding: <Church />,
      death_anniversary: <Warning />,
      birthday: <Celebration />,
      housewarming: <Home />,
      reception: <Celebration />,
      temple_function: <Event />,
      others: <Event />,
    };
    return icons[type] || <Event />;
  };

  const getEventColor = (type) => {
    const colors = {
      wedding: theme.palette.success.main,
      death_anniversary: theme.palette.error.main,
      birthday: theme.palette.info.main,
      housewarming: theme.palette.warning.main,
      reception: theme.palette.secondary.main,
      temple_function: theme.palette.primary.main,
      others: theme.palette.grey[500],
    };
    return colors[type] || theme.palette.primary.main;
  };

  const getUrgencyLevel = (days) => {
    if (days === 0) return { label: 'Today', color: 'error', severity: 3 };
    if (days <= 3) return { label: 'Soon', color: 'warning', severity: 2 };
    if (days <= 7) return { label: 'This Week', color: 'info', severity: 1 };
    return { label: 'Upcoming', color: 'success', severity: 0 };
  };

  const upcomingEvents = getUpcomingEvents();

  const styles = {
    summaryContainer: {
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(3, 1fr)',
      },
      gap: { xs: 1.5, sm: 2 },
      mb: { xs: 2, sm: 3 },
    },
    summaryCard: {
      p: { xs: 1.5, sm: 2, md: 2.5 },
      textAlign: 'center',
      borderRadius: 2.5,
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[3],
      },
    },
    summaryNumber: {
      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
      fontWeight: 700,
      lineHeight: 1.2,
      color: theme.palette.text.primary,
    },
    summaryLabel: {
      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
      color: theme.palette.text.secondary,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    listContainer: {
      borderRadius: 2.5,
      overflow: 'hidden',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
    },
    listItem: (severity) => ({
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 1.5, sm: 2 },
      px: { xs: 1.5, sm: 2, md: 3 },
      backgroundColor: theme.palette.background.paper,
      '&::before': severity > 0 ? {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        bgcolor: severity === 3 ? theme.palette.error.main : 
                 severity === 2 ? theme.palette.warning.main : 
                 theme.palette.info.main,
      } : {},
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    }),
    avatar: (color) => ({
      bgcolor: alpha(color, theme.palette.mode === 'dark' ? 0.2 : 0.1),
      color: color,
      width: { xs: 40, sm: 44, md: 48 },
      height: { xs: 40, sm: 44, md: 48 },
    }),
    primaryText: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      flexWrap: 'wrap',
      pr: { xs: 8, sm: 0 },
    },
    eventName: {
      fontWeight: 600,
      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
      color: theme.palette.text.primary,
    },
    alertIcon: {
      fontSize: { xs: 16, sm: 18 },
      color: theme.palette.error.main,
    },
    secondaryText: {
      mt: 0.5,
      pr: { xs: 8, sm: 0 },
    },
    eventMeta: {
      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
      color: theme.palette.text.secondary,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      flexWrap: 'wrap',
    },
    panchangNote: {
      display: 'inline-block',
      mt: 0.5,
      fontSize: { xs: '0.6rem', sm: '0.65rem' },
      color: theme.palette.error.main,
      backgroundColor: alpha(theme.palette.error.main, 0.1),
      px: 1,
      py: 0.25,
      borderRadius: 1,
      fontWeight: 500,
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: { xs: 1, sm: 1.5 },
      mt: 1.5,
    },
    progress: (severity) => ({
      flex: 1,
      height: { xs: 4, sm: 5, md: 6 },
      borderRadius: 3,
      backgroundColor: alpha(
        severity === 3 ? theme.palette.error.main : 
        severity === 2 ? theme.palette.warning.main : 
        theme.palette.info.main, 
        theme.palette.mode === 'dark' ? 0.2 : 0.1
      ),
      '& .MuiLinearProgress-bar': {
        backgroundColor: severity === 3 ? theme.palette.error.main : 
                        severity === 2 ? theme.palette.warning.main : 
                        theme.palette.info.main,
        borderRadius: 3,
      },
    }),
    daysLeft: {
      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      fontWeight: 500,
    },
    urgencyChip: {
      height: { xs: 20, sm: 22, md: 24 },
      position: { xs: 'absolute', sm: 'relative' },
      right: { xs: 12, sm: 'auto' },
      top: { xs: 12, sm: 'auto' },
      '& .MuiChip-label': {
        px: 1,
        fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
        fontWeight: 600,
      },
    },
    emptyState: {
      textAlign: 'center',
      py: { xs: 5, sm: 6, md: 8 },
      px: 2,
      backgroundColor: theme.palette.background.paper,
    },
    emptyIcon: {
      fontSize: { xs: 48, sm: 56, md: 64 },
      color: theme.palette.text.secondary,
      mb: { xs: 1.5, sm: 2 },
    },
    emptyTitle: {
      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
      fontWeight: 600,
      color: theme.palette.text.primary,
      mb: 0.5,
    },
    emptyText: {
      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
      color: theme.palette.text.secondary,
    },
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={styles.summaryContainer}>
        <Paper elevation={0} sx={styles.summaryCard}>
          <Typography sx={styles.summaryNumber} color="primary.main">
            {upcomingEvents.length}
          </Typography>
          <Typography sx={styles.summaryLabel}>
            Next 30 Days
          </Typography>
        </Paper>

        <Paper elevation={0} sx={styles.summaryCard}>
          <Typography sx={styles.summaryNumber} color="error.main">
            {upcomingEvents.filter(e => e.daysUntil <= 3).length}
          </Typography>
          <Typography sx={styles.summaryLabel}>
            Urgent (≤3 Days)
          </Typography>
        </Paper>

        <Paper elevation={0} sx={styles.summaryCard}>
          <Typography sx={styles.summaryNumber} color="warning.main">
            {upcomingEvents.filter(e => e.type === 'death_anniversary').length}
          </Typography>
          <Typography sx={styles.summaryLabel}>
            Death Anniv.
          </Typography>
        </Paper>
      </Box>

      {/* Events List */}
      <Paper elevation={0} sx={styles.listContainer}>
        <List disablePadding>
          <AnimatePresence>
            {upcomingEvents.map((event, index) => {
              const urgency = getUrgencyLevel(event.daysUntil);
              const eventColor = getEventColor(event.type);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <ListItem
                    sx={styles.listItem(urgency.severity)}
                    secondaryAction={
                      !isMobile && (
                        <Chip
                          label={urgency.label}
                          color={urgency.color}
                          size="small"
                          sx={styles.urgencyChip}
                        />
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={styles.avatar(eventColor)}>
                        {getEventIcon(event.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={styles.primaryText}>
                          <Typography sx={styles.eventName}>
                            {event.name}
                          </Typography>
                          {event.alert && (
                            <NotificationsActive sx={styles.alertIcon} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={styles.secondaryText}>
                          <Typography sx={styles.eventMeta}>
                            {event.client} • {format(event.eventDate, 'dd MMM yyyy')}
                          </Typography>
                          
                          {event.type === 'death_anniversary' && (
                            <Typography sx={styles.panchangNote}>
                              Panchang • {event.panchangTithi || '—'}
                            </Typography>
                          )}
                          
                          <Box sx={styles.progressContainer}>
                            <LinearProgress
                              variant="determinate"
                              value={((30 - event.daysUntil) / 30) * 100}
                              sx={styles.progress(urgency.severity)}
                            />
                            <Typography sx={styles.daysLeft}>
                              {event.daysUntil}d
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {isMobile && (
                    <Box sx={{ px: 2, pb: 1 }}>
                      <Chip
                        label={urgency.label}
                        color={urgency.color}
                        size="small"
                        sx={styles.urgencyChip}
                      />
                    </Box>
                  )}
                  {index < upcomingEvents.length - 1 && (
                    <Divider 
                      variant="inset" 
                      component="li" 
                      sx={{ 
                        ml: { xs: 7, sm: 8, md: 9 },
                        backgroundColor: theme.palette.divider,
                      }} 
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </List>

        {/* Empty State */}
        {upcomingEvents.length === 0 && (
          <Box sx={styles.emptyState}>
            <Event sx={styles.emptyIcon} />
            <Typography sx={styles.emptyTitle}>
              No Upcoming Events
            </Typography>
            <Typography sx={styles.emptyText}>
              No events scheduled in the next 30 days
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UpcomingEventsTab;