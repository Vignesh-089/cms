// src/components/calendar/CalendarDay.jsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import { format } from 'date-fns';

const CalendarDay = ({ 
  day, 
  events, 
  isCurrentMonth, 
  isToday, 
  isSelected, 
  expanded = false,
  onSelect,
  onHover,
  isMobile 
}) => {
  const theme = useTheme();

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

  const getEventIcon = (type) => {
    const icons = {
      wedding: '💒',
      death_anniversary: '🕯️',
      birthday: '🎂',
      housewarming: '🏠',
      temple_function: '🛕',
      others: '📌',
    };
    return icons[type] || '📌';
  };

  const getDayStyles = () => {
    let bgColor = 'transparent';
    let borderColor = alpha(theme.palette.divider, 0.2);
    let borderWidth = '1px';
    let opacity = isCurrentMonth ? 1 : 0.4;

    if (isToday) {
      bgColor = alpha(theme.palette.success.main, 0.1);
      borderColor = theme.palette.success.main;
      borderWidth = '2px';
    } else if (isSelected) {
      bgColor = alpha(theme.palette.primary.main, 0.1);
      borderColor = theme.palette.primary.main;
      borderWidth = '2px';
    }

    return { bgColor, borderColor, borderWidth, opacity };
  };

  const dayStyles = getDayStyles();

  const styles = {
    dayCell: {
      aspectRatio: expanded ? 'auto' : '1',
      minHeight: expanded ? 'auto' : (isMobile ? 50 : 100),
      p: isMobile ? 0.5 : 1,
      borderRadius: 2,
      bgcolor: dayStyles.bgColor,
      border: `${dayStyles.borderWidth} solid ${dayStyles.borderColor}`,
      opacity: dayStyles.opacity,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: isMobile ? 'none' : 'translateY(-2px)',
        boxShadow: isMobile ? 'none' : theme.shadows[4],
        borderColor: theme.palette.primary.main,
        bgcolor: alpha(theme.palette.primary.main, 0.05),
      },
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    },
    dayNumber: {
      fontSize: expanded ? '1rem' : (isMobile ? '0.8rem' : '0.9rem'),
      fontWeight: isToday ? 700 : 500,
      color: isToday 
        ? theme.palette.success.main
        : isSelected
          ? theme.palette.primary.main
          : theme.palette.text.primary,
      mb: isMobile ? 0.25 : 0.5,
      textAlign: 'center',
    },
    eventList: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 0.25 : 0.5,
      overflow: 'hidden',
    },
    eventItem: {
      fontSize: expanded ? '0.8rem' : (isMobile ? '0.65rem' : '0.7rem'),
      p: expanded ? 0.5 : 0.25,
      px: 1,
      borderRadius: 1,
      bgcolor: (color) => alpha(color, 0.1),
      color: (color) => color,
      borderLeft: (color) => `3px solid ${color}`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: isMobile && !expanded ? 'none' : 'block',
      fontWeight: 500,
    },
    eventIndicator: {
      width: isMobile ? 6 : 8,
      height: isMobile ? 6 : 8,
      borderRadius: '50%',
    },
    indicatorContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? 0.25 : 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      mt: 'auto',
    },
    eventCount: {
      position: 'absolute',
      top: 2,
      right: 2,
      bgcolor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: '50%',
      width: isMobile ? 16 : 20,
      height: isMobile ? 16 : 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '0.6rem' : '0.7rem',
      fontWeight: 600,
    },
    moreBadge: {
      fontSize: isMobile ? '0.55rem' : '0.65rem',
      color: theme.palette.text.secondary,
      mt: 0.25,
      textAlign: 'center',
      bgcolor: alpha(theme.palette.background.paper, 0.9),
      borderRadius: 1,
      px: 0.5,
    },
  };

  return (
    <Paper 
      sx={styles.dayCell} 
      onClick={() => onSelect(day)}
      onMouseEnter={() => onHover && onHover(day)}
      onMouseLeave={() => onHover && onHover(null)}
      elevation={0}
    >
      {/* Mobile Event Count Badge */}
      {isMobile && events.length > 0 && !expanded && (
        <Box sx={styles.eventCount}>
          {events.length}
        </Box>
      )}

      <Typography sx={styles.dayNumber}>
        {format(day, 'd')}
      </Typography>
      
      {expanded ? (
        <Box sx={styles.eventList}>
          {events.map((event) => (
            <Tooltip 
              key={event.id} 
              title={`${event.title} - ${event.client}`}
              arrow
              placement="top"
            >
              <Box sx={styles.eventItem(getEventColor(event.type))}>
                <span style={{ marginRight: 4 }}>{getEventIcon(event.type)}</span>
                {event.title}
                {event.time && !isMobile && ` • ${event.time}`}
              </Box>
            </Tooltip>
          ))}
          {events.length === 0 && (
            <Typography sx={{ 
              fontSize: '0.7rem', 
              color: theme.palette.text.secondary, 
              textAlign: 'center' 
            }}>
              No events
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={styles.indicatorContainer}>
          {events.slice(0, isMobile ? 2 : 3).map((event) => (
            <Tooltip 
              key={event.id} 
              title={event.title}
              arrow
              placement="top"
            >
              <Box
                sx={{
                  ...styles.eventIndicator,
                  bgcolor: getEventColor(event.type),
                }}
              />
            </Tooltip>
          ))}
          {events.length > (isMobile ? 2 : 3) && (
            <Typography sx={styles.moreBadge}>
              +{events.length - (isMobile ? 2 : 3)}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default CalendarDay;