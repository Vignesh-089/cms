import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  useTheme,
  alpha,
  Fade,
  Container,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Event,
  Church,
  Warning,
  Upcoming,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import tab components
import AllEventsTab from '../components/events/AllEventsTab';
import DeathAnniversaryTab from '../components/events/DeathAnniversaryTab';
import MarriageTab from '../components/events/MarriageTab';
import UpcomingEventsTab from '../components/events/UpcomingEventsTab';
import { fetchAllEvents } from '../services/eventService';

// Import styles
import { pageStyles, StyledTab } from '../styles/events.styles';

// Mock data (in real app, this would come from API)
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const styles = pageStyles(theme);

  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchAllEvents();

      if (res.data.success) {
        // Transform backend data to match UI structure
        const formattedEvents = res.data.data.map(client => ({
          id: client.id,
          name: client.full_name,
          client: client.clientName,
          date: client.eventDate,
          type: mapEventType(client.event_type),
          notes: client.notes,
          location: `${client.city || ''} ${client.state || ''}`,
          isRecurring: true,

          death_tithi:
            client.death_tithi ||
            client.calculated_anniversary_date?.death_tithi ||
            null,

          death_paksha:
            client.death_paksha ||
            client.calculated_anniversary_date?.death_paksha ||
            null,

          calculated_anniversary_date:
            client.calculated_anniversary_date?.calculated_anniversary_date ||
            client.calculated_anniversary_date ||
            null,
        }));

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const mapEventType = (type) => {
    switch (type) {
      case 'Marriage':
        return 'wedding';
      case 'Death Anniversary':
        return 'death_anniversary';
      case 'Reception':
        return 'reception';
      case 'House Warming':
        return 'housewarming';
      case 'Temple Function':
        return 'temple_function';
      default:
        return 'others';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddNewEvent = () => {
    navigate('/clients');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = (newEvent) => {
    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : e));
    } else {
      const newId = Math.max(...events.map(e => e.id), 0) + 1;
      setEvents([...events, { ...newEvent, id: newId }]);
    }
    handleCloseDialog();
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const handleRecalculate = (eventId) => {
    console.log('Recalculating event:', eventId);
    setEvents(events.map(event => {
      if (event.id === eventId && event.type === 'death_anniversary') {
        const newDate = new Date(event.date);
        newDate.setFullYear(newDate.getFullYear() + 1);
        return {
          ...event,
          nextDate: newDate.toISOString().split('T')[0],
          recalculated: true,
        };
      }
      return event;
    }));
  };

  const getFilteredEvents = (type) => {
    if (!Array.isArray(events)) return [];
    if (type === 'death_anniversary') {
      return events.filter(e => e && e.type === 'death_anniversary');
    }
    if (type === 'marriage') {
      return events.filter(e => e && ['wedding', 'reception'].includes(e.type));
    }
    return events;
  };

  const tabs = [
    {
      label: 'All Events',
      icon: <Event />,
      component: <AllEventsTab
        events={Array.isArray(events) ? events : []}
        onEdit={handleAddNewEvent}
        onDelete={handleDeleteEvent}
        onRecalculate={handleRecalculate}
      />
    },
    {
      label: 'Death Anniversaries',
      icon: <Warning />,
      component: <DeathAnniversaryTab
        events={getFilteredEvents('death_anniversary')}
        onEdit={handleAddNewEvent}
        onDelete={handleDeleteEvent}
        onRecalculate={handleRecalculate}
      />
    },
    {
      label: 'Marriage Events',
      icon: <Church />,
      component: <MarriageTab
        events={getFilteredEvents('marriage')}
        onEdit={handleAddNewEvent}
        onDelete={handleDeleteEvent}
      />
    },
    {
      label: 'Upcoming (30 Days)',
      icon: <Upcoming />,
      component: <UpcomingEventsTab
        events={Array.isArray(events) ? events : []}
        onEdit={handleAddNewEvent}
        onDelete={handleDeleteEvent}
      />
    },
  ];

  {
    loading ? (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Box sx={styles.tabContent}>
        {tabs[tabValue]?.component}
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Fade in={true} timeout={800}>
        <Container maxWidth="xl" sx={styles.root}>
          {/* Header Section - Reduced Size */}
          <Paper elevation={0} sx={styles.header}>
            <Box sx={styles.headerContent}>
              <Box>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={styles.title}
                >
                  Event Management
                </Typography>
                <Typography
                  variant="body2"
                  sx={styles.subtitle}
                >
                  Manage events, anniversaries & ceremonies
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleAddNewEvent()}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
                sx={{
                  backgroundColor: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#388E3C",
                  },
                }}
              >
                {isMobile ? 'Add' : 'Add Event'}
              </Button>
            </Box>

            {/* Stats Cards - Compact */}
            <Box sx={styles.statsContainer}>
              <Paper elevation={0} sx={styles.statCard}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={styles.statNumber}>
                  {Array.isArray(events) ? events.length : 0}
                </Typography>
                <Typography variant="caption" sx={styles.statLabel}>
                  Total
                </Typography>
              </Paper>
              <Paper elevation={0} sx={styles.statCard}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={styles.statNumber}>
                  {Array.isArray(events) ? events.filter(e => {
                    const eventDate = new Date(e.date);
                    const today = new Date();
                    return eventDate.getMonth() === today.getMonth() &&
                      eventDate.getFullYear() === today.getFullYear();
                  }).length : 0}
                </Typography>
                <Typography variant="caption" sx={styles.statLabel}>
                  This Month
                </Typography>
              </Paper>
              <Paper elevation={0} sx={styles.statCard}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={styles.statNumber}>
                  {Array.isArray(events) ? events.filter(e => e.type === 'death_anniversary').length : 0}
                </Typography>
                <Typography variant="caption" sx={styles.statLabel}>
                  Death Anniv.
                </Typography>
              </Paper>
              <Paper elevation={0} sx={styles.statCard}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={styles.statNumber}>
                  {Array.isArray(events) ? events.filter(e => {
                    const eventDate = new Date(e.date);
                    const today = new Date();
                    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 30;
                  }).length : 0}
                </Typography>
                <Typography variant="caption" sx={styles.statLabel}>
                  Upcoming
                </Typography>
              </Paper>
            </Box>
          </Paper>

          {/* Tabs Section */}
          <Paper elevation={0} sx={styles.tabsContainer}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              sx={styles.tabs}
              TabIndicatorProps={{ style: styles.tabIndicator }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={isMobile ? '' : tab.label}
                  icon={tab.icon}
                  iconPosition={isMobile ? "top" : "start"}
                  sx={StyledTab(theme, isMobile)}
                />
              ))}
            </Tabs>

            {/* Tab Content */}
            <Box sx={styles.tabContent}>
              {tabs[tabValue]?.component}
            </Box>
          </Paper>
        </Container>
      </Fade>
    </LocalizationProvider>
  );
};

export default Events;