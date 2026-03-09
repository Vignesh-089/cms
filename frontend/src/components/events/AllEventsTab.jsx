import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Paper,
  Stack,
} from '@mui/material';
import {
  Edit,
  Delete,
  Notifications,
  Repeat,
  CalendarMonth,
  Person,
  LocationOn,
  Refresh,
  Close,
  Visibility,
  Notes,
  AccessTime,
  Category,
  Info,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetailModal = ({ event, open, onClose, onEdit, onDelete, onRecalculate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const eventTypeConfig = {
    wedding: { icon: '💒', label: 'Wedding', color: theme.palette.success.main, bgColor: alpha(theme.palette.success.main, 0.1) },
    death_anniversary: { icon: '🕯️', label: 'Death Anniversary', color: theme.palette.error.main, bgColor: alpha(theme.palette.error.main, 0.1) },
    birthday: { icon: '🎂', label: 'Birthday', color: theme.palette.info.main, bgColor: alpha(theme.palette.info.main, 0.1) },
    housewarming: { icon: '🏠', label: 'Housewarming', color: theme.palette.warning.main, bgColor: alpha(theme.palette.warning.main, 0.1) },
    reception: { icon: '🥂', label: 'Reception', color: theme.palette.secondary.main, bgColor: alpha(theme.palette.secondary.main, 0.1) },
    temple_function: { icon: '🛕', label: 'Temple Function', color: theme.palette.primary.main, bgColor: alpha(theme.palette.primary.main, 0.1) },
    others: { icon: '📌', label: 'Others', color: theme.palette.grey[500], bgColor: alpha(theme.palette.grey[500], 0.1) },
  };

  const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.others;

  const modalStyles = {
    dialogPaper: {
      borderRadius: isMobile ? 0 : 3,
      bgcolor: theme.palette.background.paper,
      backgroundImage: 'none',
      overflow: 'hidden',
    },
    dialogTitle: {
      m: 0,
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.palette.divider}`,
      background: `linear-gradient(135deg, ${alpha(typeConfig.color, 0.08)} 0%, ${alpha(typeConfig.color, 0.02)} 100%)`,
    },
    titleContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
    },
    titleAvatar: {
      bgcolor: typeConfig.color,
      width: 40,
      height: 40,
      boxShadow: `0 4px 12px ${alpha(typeConfig.color, 0.3)}`,
    },
    titleText: {
      fontWeight: 700,
      fontSize: '1.25rem',
      color: theme.palette.text.primary,
    },
    closeButton: {
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: alpha(theme.palette.text.secondary, 0.1),
      },
    },
    dialogContent: {
      p: isMobile ? 2.5 : 3,
    },
    infoCard: {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.4)
        : theme.palette.grey[50],
      borderRadius: 2,
      p: 2.5,
      border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    },
    infoGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
    infoRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
    },
    infoIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: '0.7rem',
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      fontWeight: 600,
      mb: 0.25,
    },
    infoValue: {
      fontSize: '1rem',
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    infoValueSecondary: {
      fontSize: '0.85rem',
      color: theme.palette.text.secondary,
      mt: 0.25,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    },
    sectionTitle: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: theme.palette.text.primary,
      mb: 1.5,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    sectionTitleIcon: {
      fontSize: '1.2rem',
    },
    panchangBox: {
      bgcolor: alpha(typeConfig.color, 0.08),
      borderRadius: 2,
      p: 2,
      border: `2px solid ${alpha(typeConfig.color, 0.3)}`,
    },
    panchangTitle: {
      fontWeight: 700,
      color: typeConfig.color,
      fontSize: '0.85rem',
      mb: 1.5,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    panchangGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1.5,
    },
    panchangItem: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 1.5,
      p: 1.5,
      textAlign: 'center',
      border: `1px solid ${alpha(typeConfig.color, 0.2)}`,
      boxShadow: `0 2px 8px ${alpha(typeConfig.color, 0.1)}`,
    },
    panchangItemLabel: {
      fontSize: '0.65rem',
      color: theme.palette.text.secondary,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      mb: 0.5,
    },
    panchangItemValue: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: typeConfig.color,
      lineHeight: 1.3,
    },
    chipBox: {
      display: 'flex',
      gap: 1,
      flexWrap: 'wrap',
      mt: 1,
    },
    dialogActions: {
      p: 2.5,
      borderTop: `1px solid ${theme.palette.divider}`,
      justifyContent: 'space-between',
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.6)
        : alpha(theme.palette.grey[50], 0.8),
    },
    actionButton: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.85rem',
      borderRadius: 2,
      px: 2,
    },
    deleteButton: {
      color: theme.palette.error.main,
      borderColor: alpha(theme.palette.error.main, 0.3),
      '&:hover': {
        borderColor: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.1),
      },
    },
    editButton: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    recalculateButton: {
      color: theme.palette.info.main,
      borderColor: alpha(theme.palette.info.main, 0.3),
      '&:hover': {
        borderColor: theme.palette.info.main,
        backgroundColor: alpha(theme.palette.info.main, 0.1),
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: modalStyles.dialogPaper,
        elevation: 24,
      }}
    >
      <DialogTitle sx={modalStyles.dialogTitle}>
        <Box sx={modalStyles.titleContent}>
          <Avatar sx={modalStyles.titleAvatar}>
            <span style={{ fontSize: '1.2rem' }}>{typeConfig.icon}</span>
          </Avatar>
          <Typography variant="h6" sx={modalStyles.titleText}>
            Event Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={modalStyles.closeButton}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={modalStyles.dialogContent}>
        <Stack spacing={3}>
          {/* Event Name & Type Card */}
          <Paper elevation={0} sx={modalStyles.infoCard}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
              {event.name}
            </Typography>
            <Box sx={modalStyles.chipBox}>
              <Chip
                icon={<Category sx={{ fontSize: 14 }} />}
                label={typeConfig.label}
                size="small"
                sx={{
                  bgcolor: typeConfig.color,
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              {event.isRecurring && (
                <Chip
                  icon={<Repeat sx={{ fontSize: 14 }} />}
                  label="Recurring Event"
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              )}
              {event.alert && (
                <Chip
                  icon={<Notifications sx={{ fontSize: 14 }} />}
                  label="Alerts Enabled"
                  size="small"
                  color="error"
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Box>
          </Paper>

          {/* Client Information */}
          <Box sx={modalStyles.infoGrid}>
            <Box sx={modalStyles.infoRow}>
              <Box sx={{ ...modalStyles.infoIconWrapper, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                <Person />
              </Box>
              <Box sx={modalStyles.infoContent}>
                <Typography sx={modalStyles.infoLabel}>Client</Typography>
                <Typography sx={modalStyles.infoValue}>{event.client}</Typography>
              </Box>
            </Box>

            {/* Date & Time */}
            <Box sx={modalStyles.infoRow}>
              <Box sx={{ ...modalStyles.infoIconWrapper, bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                <CalendarMonth />
              </Box>
              <Box sx={modalStyles.infoContent}>
                <Typography sx={modalStyles.infoLabel}>Date & Time</Typography>
                <Typography sx={modalStyles.infoValue}>
                  {format(new Date(event.date), 'EEEE, MMMM do, yyyy')}
                </Typography>
                {event.time && (
                  <Typography sx={modalStyles.infoValueSecondary}>
                    <AccessTime sx={{ fontSize: 14 }} />
                    {event.time}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Location */}
            {event.location && (
              <Box sx={modalStyles.infoRow}>
                <Box sx={{ ...modalStyles.infoIconWrapper, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                  <LocationOn />
                </Box>
                <Box sx={modalStyles.infoContent}>
                  <Typography sx={modalStyles.infoLabel}>Location</Typography>
                  <Typography sx={modalStyles.infoValue}>{event.location}</Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Death Anniversary Details */}
          {event.type === 'death_anniversary' && (
            <Box>
              <Typography sx={modalStyles.sectionTitle}>
                <Info sx={modalStyles.sectionTitleIcon} />
                Death Anniversary Details
              </Typography>
              <Box sx={modalStyles.panchangBox}>
                <Typography sx={modalStyles.panchangTitle}>
                  <span>🕯️</span> Panchang Information
                </Typography>

                <Box sx={modalStyles.panchangGrid}>
                  {/* Tithi */}
                  <Box sx={modalStyles.panchangItem}>
                    <Typography sx={modalStyles.panchangItemLabel}>
                      Tithi
                    </Typography>
                    <Typography sx={modalStyles.panchangItemValue}>
                      {event.death_tithi || '—'}
                    </Typography>
                  </Box>

                  {/* Paksha */}
                  <Box sx={modalStyles.panchangItem}>
                    <Typography sx={modalStyles.panchangItemLabel}>
                      Paksha
                    </Typography>
                    <Typography sx={modalStyles.panchangItemValue}>
                      {event.death_paksha || '—'}
                    </Typography>
                  </Box>

                  {/* Next Date */}
                  <Box sx={modalStyles.panchangItem}>
                    <Typography sx={modalStyles.panchangItemLabel}>
                      Next Date
                    </Typography>
                    <Typography sx={modalStyles.panchangItemValue}>
                      {event.calculated_anniversary_date
                        ? format(new Date(event.calculated_anniversary_date), 'dd MMM yyyy')
                        : '—'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Notes */}
          {event.notes && (
            <Paper elevation={0} sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[500], 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            }}>
              <Typography sx={{ ...modalStyles.sectionTitle, mb: 1 }}>
                <Notes sx={modalStyles.sectionTitleIcon} />
                Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {event.notes}
              </Typography>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={modalStyles.dialogActions}>
        <Box>
          {event.type === 'death_anniversary' && (
            <Button
              variant="text"
              startIcon={<Refresh />}
              onClick={() => {
                onRecalculate(event.id);
                onClose();
              }}
              sx={{ ...modalStyles.actionButton, ...modalStyles.recalculateButton }}
            >
              Recalculate
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="text"
            startIcon={<Delete />}
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            sx={{ ...modalStyles.actionButton, ...modalStyles.deleteButton }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => {
              onEdit(event);
              onClose();
            }}
            sx={{ ...modalStyles.actionButton, ...modalStyles.editButton }}
          >
            Edit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

const AllEventsTab = ({ events, onEdit, onDelete, onRecalculate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const eventTypeConfig = {
    wedding: {
      color: 'success',
      icon: '💒',
      label: 'Wedding',
      gradient: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
    },
    death_anniversary: {
      color: 'error',
      icon: '🕯️',
      label: 'Death Anniv.',
      gradient: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
    },
    birthday: {
      color: 'info',
      icon: '🎂',
      label: 'Birthday',
      gradient: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
    },
    housewarming: {
      color: 'warning',
      icon: '🏠',
      label: 'Housewarming',
      gradient: `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`,
    },
    reception: {
      color: 'secondary',
      icon: '🥂',
      label: 'Reception',
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    temple_function: {
      color: 'primary',
      icon: '🛛',
      label: 'Temple',
      gradient: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
    others: {
      color: 'default',
      icon: '📌',
      label: 'Others',
      gradient: `linear-gradient(135deg, ${theme.palette.grey[700]} 0%, ${theme.palette.grey[600]} 100%)`,
    },
  };

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffDays = Math.ceil((event - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    if (diffDays <= 7) return 'upcoming';
    return 'future';
  };

  const getStatusChip = (status) => {
    const config = {
      today: { color: 'success', label: 'Today' },
      upcoming: { color: 'warning', label: 'Upcoming' },
      future: { color: 'info', label: 'Scheduled' },
      past: { color: 'default', label: 'Past' },
    };
    return config[status];
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // Fixed styles with consistent card heights
  const styles = {
    card: {
      height: '100%',
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
    cardHeader: (gradient) => ({
      background: gradient,
      padding: isMobile ? 1.5 : 2,
      position: 'relative',
      flexShrink: 0, // Prevent header from shrinking
    }),
    headerContent: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 1,
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      minWidth: 0,
      flex: 1,
    },
    avatar: {
      bgcolor: 'rgba(255, 255, 255, 0.2)',
      width: isMobile ? 36 : 44,
      height: isMobile ? 36 : 44,
      fontSize: isMobile ? '1.1rem' : '1.3rem',
      flexShrink: 0,
    },
    titleWrapper: {
      minWidth: 0,
      flex: 1,
    },
    title: {
      color: 'white',
      fontWeight: 600,
      fontSize: isMobile ? '1rem' : '1.1rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      mb: 0.5,
    },
    chipContainer: {
      display: 'flex',
      gap: 0.5,
      flexWrap: 'wrap',
    },
    typeChip: {
      bgcolor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      height: isMobile ? 20 : 22,
      '& .MuiChip-label': {
        px: 1,
        fontSize: isMobile ? '0.6rem' : '0.65rem',
        fontWeight: 500,
      },
    },
    statusChip: {
      height: isMobile ? 22 : 24,
      backgroundColor: 'white',
      color: theme.palette.text.primary,
      fontWeight: 600,
      flexShrink: 0,
      '& .MuiChip-label': {
        px: 1,
        fontSize: isMobile ? '0.65rem' : '0.7rem',
        fontWeight: 600,
      },
    },
    cardContent: {
      p: isMobile ? 1.5 : 2,
      flex: 1, // Take up remaining space
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      backgroundColor: theme.palette.background.paper,
      minHeight: 0, // Important for flex child
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      height: '100%',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      minHeight: 32, // Fixed height for consistent alignment
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
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    // Fixed Panchang Box with consistent height
    panchangBox: {
      bgcolor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.error.main, 0.15)
        : alpha(theme.palette.error.main, 0.1),
      borderRadius: 2,
      p: isMobile ? 1.5 : 1.5,
      border: `2px solid ${alpha(theme.palette.error.main, 0.4)}`,
      boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.15)}`,
      flexShrink: 0, // Prevent shrinking
    },
    panchangTitle: {
      fontWeight: 700,
      color: theme.palette.error.main,
      fontSize: isMobile ? '0.75rem' : '0.8rem',
      mb: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    },
    // Fixed grid layout for panchang items
    panchangGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0.75,
    },
    panchangItem: {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.3)
        : alpha(theme.palette.background.paper, 0.6),
      borderRadius: 1.5,
      p: 0.75,
      textAlign: 'center',
      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
      minHeight: 50,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    panchangItemLabel: {
      fontSize: '0.6rem',
      color: theme.palette.text.secondary,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      mb: 0.25,
    },
    panchangItemValue: {
      fontSize: isMobile ? '0.75rem' : '0.8rem',
      fontWeight: 700,
      color: theme.palette.error.main,
      lineHeight: 1.3,
      wordBreak: 'break-word',
    },
    cardActions: {
      p: isMobile ? 1 : 1.5,
      pt: isMobile ? 0.5 : 1,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: isMobile ? 1 : 0,
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      flexShrink: 0, // Prevent actions from shrinking
    },
    actionButtons: {
      display: 'flex',
      gap: 0.5,
      width: isMobile ? '100%' : 'auto',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: isMobile ? 1 : 'none',
      minWidth: isMobile ? 0 : 52,
      height: isMobile ? 32 : 28,
      textTransform: 'none',
      fontSize: isMobile ? '0.7rem' : '0.7rem',
      fontWeight: 500,
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    recalcButton: {
      width: isMobile ? '100%' : 'auto',
      height: isMobile ? 32 : 28,
      textTransform: 'none',
      fontSize: isMobile ? '0.7rem' : '0.7rem',
      fontWeight: 500,
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
    alertBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      bgcolor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      borderRadius: '50%',
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.shadows[2],
      zIndex: 10,
    },
    emptyState: {
      textAlign: 'center',
      py: 8,
      px: 3,
      bgcolor: theme.palette.background.paper,
      borderRadius: 3,
      border: `1px dashed ${theme.palette.divider}`,
    },
  };

  return (
    <Box sx={{ px: isMobile ? 1 : 0 }}>
      <AnimatePresence>
        <Grid container spacing={isMobile ? 1.5 : 3}>
          {events.map((event, index) => {
            const status = getEventStatus(event.date);
            const statusConfig = getStatusChip(status);
            const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.others;

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
                    {/* Header with Gradient */}
                    <Box sx={styles.cardHeader(typeConfig.gradient)}>
                      <Box sx={styles.headerContent}>
                        <Box sx={styles.titleSection}>
                          <Avatar sx={styles.avatar}>
                            <span>{typeConfig.icon}</span>
                          </Avatar>
                          <Box sx={styles.titleWrapper}>
                            <Typography sx={styles.title}>
                              {event.name}
                            </Typography>
                            <Box sx={styles.chipContainer}>
                              <Chip
                                label={typeConfig.label}
                                size="small"
                                sx={styles.typeChip}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Chip
                          label={statusConfig.label}
                          size="small"
                          color={statusConfig.color}
                          sx={styles.statusChip}
                        />
                      </Box>
                    </Box>

                    {/* Content - Fixed height structure */}
                    <CardContent sx={styles.cardContent}>
                      <Box sx={styles.contentWrapper}>
                        {/* Client - Always present */}
                        <Box sx={styles.infoRow}>
                          <Person sx={styles.infoIcon} />
                          <Typography sx={styles.infoTextBold} noWrap>
                            {event.client}
                          </Typography>
                        </Box>

                        {/* Date - Always present */}
                        <Box sx={styles.infoRow}>
                          <CalendarMonth sx={styles.infoIcon} />
                          <Typography sx={styles.infoText} noWrap>
                            {format(new Date(event.date), 'dd MMM yyyy')}
                          </Typography>
                        </Box>

                        {/* Location - Conditional, but maintains height with empty state if needed */}
                        <Box sx={styles.infoRow}>
                          <LocationOn sx={styles.infoIcon} />
                          <Typography sx={styles.infoText} color="text.secondary" noWrap>
                            {event.location || 'No location'}
                          </Typography>
                        </Box>

                        {/* Death Anniversary Details - Fixed height box */}
                        {event.type === 'death_anniversary' ? (
                          <Box sx={styles.panchangBox}>
                            <Typography sx={styles.panchangTitle}>
                              <span>🕯️</span> Death Anniversary
                            </Typography>
                            <Box sx={styles.panchangGrid}>
                              <Box sx={styles.panchangItem}>
                                <Typography sx={styles.panchangItemLabel}>
                                  Tithi
                                </Typography>
                                <Typography sx={styles.panchangItemValue}>
                                  {event.death_tithi || '—'}
                                </Typography>
                              </Box>
                              <Box sx={styles.panchangItem}>
                                <Typography sx={styles.panchangItemLabel}>
                                  Paksha
                                </Typography>
                                <Typography sx={styles.panchangItemValue}>
                                  {event.death_paksha || '—'}
                                </Typography>
                              </Box>
                              <Box sx={styles.panchangItem}>
                                <Typography sx={styles.panchangItemLabel}>
                                  Next Date
                                </Typography>
                                <Typography sx={styles.panchangItemValue}>
                                  {event.calculated_anniversary_date
                                    ? format(new Date(event.calculated_anniversary_date), 'dd MMM')
                                    : '—'}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ) : (
                          /* Placeholder for non-death events to maintain consistent height */
                          <Box sx={{ height: isMobile ? 100 : 108 }} />
                        )}
                      </Box>
                    </CardContent>

                    {/* Actions - Fixed at bottom */}
                    <CardActions sx={styles.cardActions}>
                      <Box sx={styles.actionButtons}>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => onEdit(event)}
                          startIcon={<Edit sx={{ fontSize: 14 }} />}
                          sx={styles.actionButton}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => onDelete(event.id)}
                          startIcon={<Delete sx={{ fontSize: 14 }} />}
                          sx={styles.actionButton}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleViewEvent(event)}
                          startIcon={<Visibility sx={{ fontSize: 14 }} />}
                          sx={styles.actionButton}
                        >
                          View
                        </Button>
                      </Box>
                      {event.type === 'death_anniversary' && (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => onRecalculate(event.id)}
                          startIcon={<Refresh sx={{ fontSize: 14 }} />}
                          sx={styles.recalcButton}
                        >
                          {!isMobile && 'Recalculate'}
                          {isMobile && 'Calc'}
                        </Button>
                      )}
                    </CardActions>

                    {/* Alert Badge */}
                    {event.alert && (
                      <Tooltip title="Alerts Enabled">
                        <Box sx={styles.alertBadge}>
                          <Notifications sx={{ fontSize: 16 }} />
                        </Box>
                      </Tooltip>
                    )}
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
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add New Event" to create your first event
          </Typography>
        </Box>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          open={modalOpen}
          onClose={handleCloseModal}
          onEdit={onEdit}
          onDelete={onDelete}
          onRecalculate={onRecalculate}
        />
      )}
    </Box>
  );
};

export default AllEventsTab;