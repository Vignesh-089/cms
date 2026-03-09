// src/components/calendar/EventFilters.jsx
import React from 'react';
import {
  Box,
  Paper,
  Chip,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';

const EventFilters = ({ filters, onFilterChange, eventTypes, isMobile = false }) => {
  const theme = useTheme();

  const styles = {
    container: {
      p: isMobile ? 1.5 : 2,
      mb: isMobile ? 2 : 3,
      borderRadius: isMobile ? 2 : 3,
      bgcolor: theme.palette.background.paper,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 1.5,
    },
    title: {
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    filterChip: (isSelected, color) => ({
      m: isMobile ? 0.25 : 0.5,
      bgcolor: isSelected ? color : 'transparent',
      color: isSelected ? '#fff' : theme.palette.text.secondary,
      border: `1px solid ${isSelected ? color : alpha(theme.palette.divider, 0.5)}`,
      '&:hover': {
        bgcolor: isSelected ? color : alpha(color, 0.1),
      },
      '& .MuiChip-label': {
        fontWeight: 500,
        fontSize: isMobile ? '0.7rem' : '0.75rem',
      },
      '& .MuiChip-icon': {
        fontSize: isMobile ? '0.8rem' : '1rem',
        color: isSelected ? '#fff' : color,
      },
    }),
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? 0.25 : 0.5,
    },
  };

  return (
    <Paper sx={styles.container} elevation={0}>
      {!isMobile && (
        <Box sx={styles.header}>
          <FilterList sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          <Typography sx={styles.title}>
            Filter Events by Type
          </Typography>
        </Box>
      )}
      
      <Box sx={styles.chipContainer}>
        {eventTypes.map((type) => (
          <Chip
            key={type.type}
            icon={<span>{type.icon}</span>}
            label={isMobile ? '' : type.label}
            onClick={() => onFilterChange(type.type)}
            sx={styles.filterChip(filters[type.type], type.color)}
            size={isMobile ? 'small' : 'medium'}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default EventFilters;