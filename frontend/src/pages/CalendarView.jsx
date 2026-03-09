import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
  alpha,
  Drawer,
  Fab,
  Badge,
  Snackbar,
  Alert,
  Zoom,
  Fade,
  Container,
  Skeleton,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  FilterList,
  Print,
  Download,
  Event as EventIcon,
  Close as CloseIcon,
  CalendarMonth,
  ViewModule,
  ViewWeek,
  ViewDay,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, startOfMonth, endOfMonth } from 'date-fns';

// Import components
import CalendarDay from '../components/calendar/CalendarDay';
import EventSidebar from '../components/calendar/EventSidebar';
import UpcomingWeek from '../components/calendar/UpcomingWeek';
import PanchangDetails from '../components/calendar/PanchangDetails';
import EventFilters from '../components/calendar/EventFilters';
import MobileEventDrawer from '../components/calendar/MobileEventDrawer';

const CalendarView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [filters, setFilters] = useState({
    wedding: true,
    death_anniversary: true,
    birthday: true,
    housewarming: true,
    temple_function: true,
    others: true,
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showPanchang, setShowPanchang] = useState(false);

  // Mock calendar events
  const [events, setEvents] = useState([
    {
      id: 1,
      date: '2024-12-25',
      title: 'Rajesh & Priya Wedding',
      type: 'wedding',
      color: theme.palette.success.main,
      client: 'Rajesh Sharma',
      location: 'Mumbai, Maharashtra',
      time: '11:00 AM',
      icon: '💒',
    },
    {
      id: 2,
      date: '2024-12-28',
      title: 'Late Ramesh Shraddham',
      type: 'death_anniversary',
      color: theme.palette.error.main,
      client: 'Ramesh Family',
      location: 'Home',
      icon: '🕯️',
      panchang: {
        tithi: 'Dwitiya',
        paksha: 'Shukla Paksha',
        maas: 'Margashirsha',
        nextDate: '2025-12-18',
      },
    },
    {
      id: 3,
      date: '2024-12-30',
      title: 'Amit Birthday',
      type: 'birthday',
      color: theme.palette.info.main,
      client: 'Amit Patel',
      location: 'Restaurant',
      icon: '🎂',
    },
    {
      id: 4,
      date: '2025-01-02',
      title: 'Gupta Housewarming',
      type: 'housewarming',
      color: theme.palette.warning.main,
      client: 'Gupta Family',
      location: 'New Home, Pune',
      icon: '🏠',
    },
    {
      id: 5,
      date: '2024-12-26',
      title: 'Annual Temple Puja',
      type: 'temple_function',
      color: theme.palette.primary.main,
      client: 'Shiva Temple Trust',
      location: 'Shiva Temple',
      icon: '🛕',
    },
    {
      id: 6,
      date: '2024-12-15',
      title: 'Death Anniversary - Lakshmi Bai',
      type: 'death_anniversary',
      color: theme.palette.error.main,
      client: 'Verma Family',
      icon: '🕯️',
      panchang: {
        tithi: 'Saptami',
        paksha: 'Krishna Paksha',
        maas: 'Pausha',
        nextDate: '2025-12-05',
      },
    },
    {
      id: 7,
      date: '2024-12-20',
      title: 'Death Anniversary - Mohan Das',
      type: 'death_anniversary',
      color: theme.palette.error.main,
      client: 'Das Family',
      icon: '🕯️',
      panchang: {
        tithi: 'Dashami',
        paksha: 'Shukla Paksha',
        maas: 'Margashirsha',
        nextDate: '2025-12-10',
      },
    },
    {
      id: 8,
      date: '2024-12-22',
      title: 'Community Lunch',
      type: 'others',
      color: theme.palette.grey[500],
      client: 'Community Center',
      icon: '📌',
    },
  ]);

  const eventTypes = [
    { type: 'wedding', label: 'Wedding', color: theme.palette.success.main, icon: '💒', bgColor: alpha(theme.palette.success.main, 0.1) },
    { type: 'death_anniversary', label: 'Death Anniv.', color: theme.palette.error.main, icon: '🕯️', bgColor: alpha(theme.palette.error.main, 0.1) },
    { type: 'birthday', label: 'Birthday', color: theme.palette.info.main, icon: '🎂', bgColor: alpha(theme.palette.info.main, 0.1) },
    { type: 'housewarming', label: 'Housewarming', color: theme.palette.warning.main, icon: '🏠', bgColor: alpha(theme.palette.warning.main, 0.1) },
    { type: 'temple_function', label: 'Temple', color: theme.palette.primary.main, icon: '🛕', bgColor: alpha(theme.palette.primary.main, 0.1) },
    { type: 'others', label: 'Others', color: theme.palette.grey[500], icon: '📌', bgColor: alpha(theme.palette.grey[500], 0.1) },
  ];

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleFilterChange = (type) => {
    setFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePrevious = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (view === 'day') {
        setSelectedDate(subDays(selectedDate, 1));
      } else if (view === 'week') {
        setSelectedDate(subDays(selectedDate, 7));
      } else {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
      }
      setIsLoading(false);
    }, 300);
  };

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (view === 'day') {
        setSelectedDate(addDays(selectedDate, 1));
      } else if (view === 'week') {
        setSelectedDate(addDays(selectedDate, 7));
      } else {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
      }
      setIsLoading(false);
    }, 300);
  };

  const handleToday = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedDate(new Date());
      setIsLoading(false);
      showSnackbar('Navigated to today', 'success');
    }, 300);
  };

  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event =>
      event.date === dateStr && filters[event.type]
    );
  };

  const getFilteredEvents = () => {
    return events.filter(event => filters[event.type]);
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getMonthDays = () => {
    const start = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const handleEditEvent = (event) => {
    console.log('Edit event', event);
    showSnackbar(`Editing: ${event.title}`, 'info');
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showSnackbar('Event deleted successfully', 'success');
  };

  const handleRecalculate = (id) => {
    console.log('Recalculate anniversary', id);
    showSnackbar('Anniversary recalculated', 'success');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  // Mobile-optimized render
  // Mobile-optimized render
  if (isMobile) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          pb: 8,
        }}>
          {/* Header with minimal info */}
          <Box sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: theme.palette.background.paper,
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Calendar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(selectedDate, 'MMMM yyyy')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={handlePrevious}>
                  <ChevronLeft />
                </IconButton>
                <IconButton size="small" onClick={handleToday}>
                  <Today fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleNext}>
                  <ChevronRight />
                </IconButton>
                <IconButton size="small" onClick={toggleFilterDrawer}>
                  <FilterList fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* View Toggle */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                  p: 0.25,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    px: 3,
                    py: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                    },
                  },
                }}
              >
                <ToggleButton value="month">Month</ToggleButton>
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="day">Day</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            mx: 1.5,
            mt: 1.5,
            mb: 1,
            borderRadius: 2,
          }}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Today
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {events.filter(e => e.date === format(new Date(), 'yyyy-MM-dd')).length}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                This Week
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {events.filter(e => {
                  const date = new Date(e.date);
                  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
                  return date >= weekStart && date <= weekEnd;
                }).length}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                This Month
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {events.filter(e => new Date(e.date).getMonth() === selectedDate.getMonth()).length}
              </Typography>
            </Box>
          </Box>

          {/* Week Days Header - Single letters only */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            px: 1.5,
            mt: 1,
            mb: 0.5,
          }}>
            {weekDays.map(day => (
              <Typography key={day} sx={{
                textAlign: 'center',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: theme.palette.text.secondary,
              }}>
                {day.charAt(0)}
              </Typography>
            ))}
          </Box>

          {/* Calendar Grid - Numbers only, no borders */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            px: 1.5,
          }}>
            {view === 'month' ? getMonthDays().map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
              const isSelectedDay = isSameDay(day, selectedDate);
              const isTodayDay = isToday(day);

              return (
                <Box
                  key={index}
                  onClick={() => {
                    setSelectedDate(day);
                    if (dayEvents.length > 0) {
                      setMobileDrawerOpen(true);
                    }
                  }}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    opacity: isCurrentMonth ? 1 : 0.3,
                    bgcolor: isSelectedDay
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    borderRadius: isSelectedDay ? '50%' : 0,
                    width: '100%',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Day number */}
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: isTodayDay ? 700 : 400,
                      color: isTodayDay
                        ? theme.palette.primary.main
                        : isSelectedDay
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isTodayDay
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      borderRadius: '50%',
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>

                  {/* Event indicators - small dots */}
                  {dayEvents.length > 0 && (
                    <Box sx={{
                      display: 'flex',
                      gap: 0.25,
                      mt: 0.25,
                    }}>
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: event.color,
                          }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <Typography
                          sx={{
                            fontSize: '0.5rem',
                            color: theme.palette.text.secondary,
                            ml: 0.25,
                          }}
                        >
                          +{dayEvents.length - 3}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              );
            }) : view === 'week' ? getWeekDays().map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isSelectedDay = isSameDay(day, selectedDate);
              const isTodayDay = isToday(day);

              return (
                <Box
                  key={index}
                  onClick={() => {
                    setSelectedDate(day);
                    if (dayEvents.length > 0) {
                      setMobileDrawerOpen(true);
                    }
                  }}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    bgcolor: isSelectedDay
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    borderRadius: isSelectedDay ? '50%' : 0,
                    width: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: isTodayDay ? 700 : 400,
                      color: isTodayDay
                        ? theme.palette.primary.main
                        : isSelectedDay
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isTodayDay
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      borderRadius: '50%',
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>

                  {dayEvents.length > 0 && (
                    <Box sx={{
                      display: 'flex',
                      gap: 0.25,
                      mt: 0.25,
                    }}>
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: event.color,
                          }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <Typography
                          sx={{
                            fontSize: '0.5rem',
                            color: theme.palette.text.secondary,
                            ml: 0.25,
                          }}
                        >
                          +{dayEvents.length - 3}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              );
            }) : (
              // Day view
              <Box sx={{ gridColumn: 'span 7', p: 2 }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center' }}>
                  {format(selectedDate, 'd')}
                </Typography>
                <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
                  {format(selectedDate, 'EEEE, MMMM d')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {getEventsForDate(selectedDate).map(event => (
                    <Paper
                      key={event.id}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        bgcolor: alpha(event.color, 0.1),
                        borderLeft: `3px solid ${event.color}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.time || 'All day'}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Rest of the mobile components remain the same... */}
          <Box sx={{ px: 1.5, mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowPanchang(!showPanchang)}
              sx={{
                borderRadius: 2,
                borderColor: alpha(theme.palette.primary.main, 0.3),
              }}
            >
              {showPanchang ? 'Hide' : 'Show'} Panchang Details
            </Button>
          </Box>

          {showPanchang && (
            <Box sx={{ px: 1.5, mt: 2 }}>
              <PanchangDetails
                selectedDate={selectedDate}
                events={getFilteredEvents().filter(e => e.type === 'death_anniversary')}
                isMobile={true}
              />
            </Box>
          )}

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="bottom"
            open={filterDrawerOpen}
            onClose={toggleFilterDrawer}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: '70vh',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filter Events
                </Typography>
                <IconButton onClick={toggleFilterDrawer} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              <EventFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                eventTypes={eventTypes}
                isMobile={true}
              />
            </Box>
          </Drawer>

          {/* Mobile Event Drawer */}
          <MobileEventDrawer
            open={mobileDrawerOpen}
            onClose={toggleMobileDrawer}
            selectedDate={selectedDate}
            events={getEventsForDate(selectedDate)}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onRecalculate={handleRecalculate}
          />

          {/* FAB for quick add */}
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => showSnackbar('Add new event', 'info')}
          >
            <EventIcon />
          </Fab>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    );
  }

  // Desktop/Tablet version (keep original but optimized)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Desktop header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Calendar View
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your events and Panchang-based anniversaries
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Calendar Area */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              {/* Desktop navigation */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {format(selectedDate, 'MMMM yyyy')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={handlePrevious}>
                      <ChevronLeft />
                    </IconButton>
                    <IconButton onClick={handleNext}>
                      <ChevronRight />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    size="small"
                  >
                    <ToggleButton value="month">Month</ToggleButton>
                    <ToggleButton value="week">Week</ToggleButton>
                    <ToggleButton value="day">Day</ToggleButton>
                  </ToggleButtonGroup>

                  <Button
                    variant="outlined"
                    startIcon={<Today />}
                    onClick={handleToday}
                  >
                    Today
                  </Button>

                  <IconButton onClick={toggleFilterDrawer}>
                    <FilterList />
                  </IconButton>
                </Box>
              </Box>

              {/* Week Days Header */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 1,
                mb: 1.5,
              }}>
                {weekDays.map(day => (
                  <Typography key={day} sx={{
                    textAlign: 'center',
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}>
                    {day}
                  </Typography>
                ))}
              </Box>

              {/* Calendar Grid */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 1,
              }}>
                {view === 'month' ? getMonthDays().map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = day.getMonth() === selectedDate.getMonth();

                  return (
                    <CalendarDay
                      key={index}
                      day={day}
                      events={dayEvents}
                      isCurrentMonth={isCurrentMonth}
                      isToday={isToday(day)}
                      isSelected={isSameDay(day, selectedDate)}
                      onSelect={() => setSelectedDate(day)}
                      onHover={setHoveredDate}
                    />
                  );
                }) : view === 'week' ? getWeekDays().map((day, index) => {
                  const dayEvents = getEventsForDate(day);

                  return (
                    <CalendarDay
                      key={index}
                      day={day}
                      events={dayEvents}
                      isCurrentMonth={true}
                      isToday={isToday(day)}
                      isSelected={isSameDay(day, selectedDate)}
                      onSelect={() => setSelectedDate(day)}
                      onHover={setHoveredDate}
                    />
                  );
                }) : (
                  <Box sx={{ gridColumn: 'span 7' }}>
                    <CalendarDay
                      day={selectedDate}
                      events={getEventsForDate(selectedDate)}
                      isCurrentMonth={true}
                      isToday={isToday(selectedDate)}
                      isSelected={true}
                      expanded={true}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <EventSidebar
                selectedDate={selectedDate}
                events={getEventsForDate(selectedDate)}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onRecalculate={handleRecalculate}
              />
            </Paper>
          </Grid>

          {/* Panchang Details */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <PanchangDetails
                selectedDate={selectedDate}
                events={getFilteredEvents().filter(e => e.type === 'death_anniversary')}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Desktop Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={toggleFilterDrawer}
          PaperProps={{
            sx: { width: 320, p: 3 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filter Events
            </Typography>
            <IconButton onClick={toggleFilterDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <EventFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            eventTypes={eventTypes}
          />
        </Drawer>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default CalendarView;