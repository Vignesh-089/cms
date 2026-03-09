// src/components/calendar/UpcomingWeek.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { format, addDays, isSameDay } from 'date-fns';

const UpcomingWeek = ({ selectedDate, events, onDateSelect }) => {
  const theme = useTheme();

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  const getEventsCount = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr).length;
  };

  const getEventTypesForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEvents = events.filter(event => event.date === dateStr);
    const types = dayEvents.map(e => e.type);
    return [...new Set(types)];
  };

  const getEventColor = (type) => {
    const colors = {
      wedding: theme.palette.success.main,
      death_anniversary: theme.palette.error.main,
      birthday: theme.palette.info.main,
      housewarming: theme.palette.warning.main,
      temple_function: theme.palette.primary.main,
      others: theme.palette.grey[500],
    };
    return colors[type] || theme.palette.grey[500];
  };

  const isMobile = window.innerWidth < 600;

  const styles = {
    container: {
      p: isMobile ? 1.5 : 2,
      borderRadius: 3,
      bgcolor: theme.palette.background.paper,
    },
    title: {
      fontSize: isMobile ? '0.95rem' : '1rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
      mb: 2,
    },
    weekGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: isMobile ? 1 : 2,
    },
    dayCard: (isSelected) => ({
      p: isMobile ? 1 : 1.5,
      textAlign: 'center',
      borderRadius: 2,
      bgcolor: isSelected 
        ? alpha(theme.palette.primary.main, 0.1)
        : theme.palette.background.paper,
      border: isSelected 
        ? `2px solid ${theme.palette.primary.main}`
        : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[2],
        borderColor: theme.palette.primary.main,
      },
    }),
    weekday: {
      fontSize: isMobile ? '0.6rem' : '0.7rem',
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      mb: 0.5,
    },
    date: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
      mb: 1,
    },
    eventIndicators: {
      display: 'flex',
      justifyContent: 'center',
      gap: 0.5,
      flexWrap: 'wrap',
    },
    eventDot: (color) => ({
      width: isMobile ? 6 : 8,
      height: isMobile ? 6 : 8,
      borderRadius: '50%',
      bgcolor: color,
    }),
    count: {
      fontSize: isMobile ? '0.6rem' : '0.7rem',
      color: theme.palette.text.secondary,
      mt: 0.5,
    },
  };

  const weekDays = getWeekDays();

  return (
    <Paper sx={styles.container} elevation={0}>
      <Typography sx={styles.title}>
        Next 7 Days
      </Typography>
      
      <Box sx={styles.weekGrid}>
        {weekDays.map((day, index) => {
          const eventCount = getEventsCount(day);
          const eventTypes = getEventTypesForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <Box
              key={index}
              sx={styles.dayCard(isSelected)}
              onClick={() => onDateSelect(day)}
            >
              <Typography sx={styles.weekday}>
                {format(day, 'EEE')}
              </Typography>
              <Typography sx={styles.date}>
                {format(day, 'd')}
              </Typography>
              
              {eventCount > 0 && (
                <>
                  <Box sx={styles.eventIndicators}>
                    {eventTypes.slice(0, 3).map((type, i) => (
                      <Box
                        key={i}
                        sx={styles.eventDot(getEventColor(type))}
                      />
                    ))}
                  </Box>
                  <Typography sx={styles.count}>
                    {eventCount}
                  </Typography>
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default UpcomingWeek;