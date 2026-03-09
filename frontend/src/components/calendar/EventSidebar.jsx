// src/components/calendar/EventSidebar.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Tooltip,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit,
  Delete,
  Refresh,
  Person,
  LocationOn,
  AccessTime,
  Event as EventIcon,
  CalendarMonth,
} from '@mui/icons-material';
import { format } from 'date-fns';

const EventSidebar = ({ selectedDate, events, onEdit, onDelete, onRecalculate, isMobile = false }) => {
  const theme = useTheme();

  const getEventTypeDetails = (type) => {
    const details = {
      wedding: { 
        icon: '💒', 
        label: 'Wedding', 
        color: theme.palette.success.main, 
        bgColor: alpha(theme.palette.success.main, 0.1) 
      },
      death_anniversary: { 
        icon: '🕯️', 
        label: 'Death Anniversary', 
        color: theme.palette.error.main, 
        bgColor: alpha(theme.palette.error.main, 0.1) 
      },
      birthday: { 
        icon: '🎂', 
        label: 'Birthday', 
        color: theme.palette.info.main, 
        bgColor: alpha(theme.palette.info.main, 0.1) 
      },
      housewarming: { 
        icon: '🏠', 
        label: 'Housewarming', 
        color: theme.palette.warning.main, 
        bgColor: alpha(theme.palette.warning.main, 0.1) 
      },
      temple_function: { 
        icon: '🛕', 
        label: 'Temple Function', 
        color: theme.palette.primary.main, 
        bgColor: alpha(theme.palette.primary.main, 0.1) 
      },
      others: { 
        icon: '📌', 
        label: 'Others', 
        color: theme.palette.grey[500], 
        bgColor: alpha(theme.palette.grey[500], 0.1) 
      },
    };
    return details[type] || details.others;
  };

  const styles = {
    dateHeader: {
      mb: 3,
      textAlign: 'center',
    },
    dateTitle: {
      fontSize: isMobile ? '1.1rem' : '1.2rem',
      fontWeight: 700,
      color: theme.palette.primary.main,
      mb: 0.5,
    },
    dateSubtitle: {
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      color: theme.palette.text.secondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
    },
    eventCard: {
      p: isMobile ? 1.5 : 2.5,
      mb: 2,
      borderRadius: 2.5,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      transition: 'all 0.3s ease',
      bgcolor: theme.palette.background.paper,
      '&:hover': {
        boxShadow: theme.shadows[4],
        transform: isMobile ? 'none' : 'translateY(-2px)',
        borderColor: 'transparent',
      },
    },
    eventHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      mb: 2,
    },
    eventTitle: {
      fontSize: isMobile ? '0.95rem' : '1rem',
      fontWeight: 700,
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    eventTypeChip: {
      height: 28,
      borderRadius: 2,
      '& .MuiChip-label': {
        px: 1.5,
        fontSize: '0.75rem',
        fontWeight: 600,
      },
    },
    eventDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      mb: 2,
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
    },
    detailIcon: {
      fontSize: 18,
      color: theme.palette.text.secondary,
    },
    detailText: {
      fontSize: isMobile ? '0.8rem' : '0.85rem',
      color: theme.palette.text.primary,
    },
    panchangBox: {
      bgcolor: alpha(theme.palette.error.main, 0.08),
      borderRadius: 2,
      p: 2,
      mb: 2,
      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
    },
    panchangTitle: {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: theme.palette.error.main,
      mb: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    panchangGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
    },
    panchangItem: {
      textAlign: 'center',
      p: 1,
      bgcolor: alpha(theme.palette.background.paper, 0.6),
      borderRadius: 1.5,
    },
    panchangLabel: {
      fontSize: '0.65rem',
      color: theme.palette.text.secondary,
      display: 'block',
      mb: 0.5,
    },
    panchangValue: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: theme.palette.error.main,
    },
    actionButtons: {
      display: 'flex',
      gap: 1,
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
    },
    actionButton: {
      minWidth: isMobile ? 60 : 80,
      height: 32,
      textTransform: 'none',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      fontWeight: 600,
      borderRadius: 2,
    },
    emptyState: {
      textAlign: 'center',
      py: 6,
    },
    emptyIcon: {
      fontSize: 64,
      color: alpha(theme.palette.text.secondary, 0.2),
      mb: 2,
    },
    emptyText: {
      fontSize: isMobile ? '0.9rem' : '1rem',
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
  };

  return (
    <Box>
      <Box sx={styles.dateHeader}>
        <Typography sx={styles.dateTitle}>
          {format(selectedDate, 'EEEE')}
        </Typography>
        <Typography sx={styles.dateSubtitle}>
          <CalendarMonth sx={{ fontSize: 16 }} />
          {format(selectedDate, 'MMMM d, yyyy')}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {events.length > 0 ? (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
            Scheduled Events ({events.length})
          </Typography>
          
          {events.map((event) => {
            const typeDetails = getEventTypeDetails(event.type);
            
            return (
              <Paper key={event.id} sx={styles.eventCard} elevation={0}>
                <Box sx={styles.eventHeader}>
                  <Typography sx={styles.eventTitle}>
                    <Avatar 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        bgcolor: typeDetails.bgColor,
                        color: typeDetails.color,
                        fontSize: '1rem',
                      }}
                    >
                      {typeDetails.icon}
                    </Avatar>
                    {event.title}
                  </Typography>
                  <Chip
                    label={typeDetails.label}
                    size="small"
                    sx={{
                      ...styles.eventTypeChip,
                      bgcolor: typeDetails.bgColor,
                      color: typeDetails.color,
                      border: `1px solid ${alpha(typeDetails.color, 0.3)}`,
                    }}
                  />
                </Box>

                <Box sx={styles.eventDetails}>
                  <Box sx={styles.detailRow}>
                    <Person sx={styles.detailIcon} />
                    <Typography sx={styles.detailText}>
                      {event.client}
                    </Typography>
                  </Box>
                  
                  {event.location && (
                    <Box sx={styles.detailRow}>
                      <LocationOn sx={styles.detailIcon} />
                      <Typography sx={styles.detailText}>
                        {event.location}
                      </Typography>
                    </Box>
                  )}
                  
                  {event.time && (
                    <Box sx={styles.detailRow}>
                      <AccessTime sx={styles.detailIcon} />
                      <Typography sx={styles.detailText}>
                        {event.time}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {event.type === 'death_anniversary' && event.panchang && (
                  <Box sx={styles.panchangBox}>
                    <Typography sx={styles.panchangTitle}>
                      <span>🕯️</span> Panchang Details
                    </Typography>
                    <Box sx={styles.panchangGrid}>
                      <Box sx={styles.panchangItem}>
                        <Typography sx={styles.panchangLabel}>Tithi</Typography>
                        <Typography sx={styles.panchangValue}>
                          {event.panchang.tithi}
                        </Typography>
                      </Box>
                      <Box sx={styles.panchangItem}>
                        <Typography sx={styles.panchangLabel}>Paksha</Typography>
                        <Typography sx={styles.panchangValue}>
                          {event.panchang.paksha}
                        </Typography>
                      </Box>
                      <Box sx={styles.panchangItem}>
                        <Typography sx={styles.panchangLabel}>Maas</Typography>
                        <Typography sx={styles.panchangValue}>
                          {event.panchang.maas}
                        </Typography>
                      </Box>
                    </Box>
                    {event.panchang.nextDate && (
                      <Typography sx={{ 
                        fontSize: '0.7rem', 
                        color: theme.palette.text.secondary,
                        mt: 1.5,
                        textAlign: 'center',
                        fontStyle: 'italic',
                      }}>
                        Next: {format(new Date(event.panchang.nextDate), 'dd MMM yyyy')}
                      </Typography>
                    )}
                  </Box>
                )}

                <Box sx={styles.actionButtons}>
                  <Tooltip title="Edit" arrow>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onEdit(event)}
                      startIcon={<Edit />}
                      sx={styles.actionButton}
                    >
                      Edit
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(event.id)}
                      startIcon={<Delete />}
                      sx={styles.actionButton}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                  {event.type === 'death_anniversary' && (
                    <Tooltip title="Recalculate" arrow>
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => onRecalculate(event.id)}
                        startIcon={<Refresh />}
                        sx={styles.actionButton}
                      >
                        Recalc
                      </Button>
                    </Tooltip>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Box sx={styles.emptyState}>
          <EventIcon sx={styles.emptyIcon} />
          <Typography sx={styles.emptyText}>
            No events scheduled for this day
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EventSidebar;