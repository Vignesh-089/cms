// src/components/calendar/MobileEventDrawer.jsx
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import EventSidebar from './EventSidebar';

const MobileEventDrawer = ({ 
  open, 
  onClose, 
  selectedDate, 
  events, 
  onEdit, 
  onDelete, 
  onRecalculate 
}) => {
  const theme = useTheme();

  const styles = {
    drawerPaper: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: '85vh',
      bgcolor: theme.palette.background.paper,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    title: {
      fontSize: '1rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    date: {
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
      mt: 0.25,
    },
    content: {
      p: 2,
      overflow: 'auto',
      height: 'calc(100% - 70px)',
    },
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: styles.drawerPaper,
      }}
    >
      <Box sx={styles.header}>
        <Box>
          <Typography sx={styles.title}>
            Events for {format(selectedDate, 'EEEE')}
          </Typography>
          <Typography sx={styles.date}>
            {format(selectedDate, 'MMMM d, yyyy')}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={styles.content}>
        <EventSidebar
          selectedDate={selectedDate}
          events={events}
          onEdit={onEdit}
          onDelete={onDelete}
          onRecalculate={onRecalculate}
          isMobile={true}
        />
      </Box>
    </Drawer>
  );
};

export default MobileEventDrawer;