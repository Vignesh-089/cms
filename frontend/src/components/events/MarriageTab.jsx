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
  Avatar,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Edit,
  Delete,
  Favorite,
  People,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const MarriageTab = ({ events, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getMarriageType = (type) => {
    return type === 'wedding' ? 'Wedding' : 'Reception';
  };

  const getMarriageIcon = (type) => {
    return type === 'wedding' ? '💒' : '🥂';
  };

  const getMarriageColor = (type) => {
    return type === 'wedding' ? 'success' : 'secondary';
  };

  // Ensure events is an array
  const safeEvents = Array.isArray(events) ? events : [];

  const styles = {
    card: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2.5,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
      },
    },
    weddingBadge: {
      position: 'absolute',
      top: 15,
      right: -30,
      transform: 'rotate(45deg)',
      bgcolor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      py: 0.35,
      px: 3.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.shadows[1],
      zIndex: 1,
      width: 100,
    },
    heartIcon: {
      fontSize: isMobile ? 12 : 14,
      mr: 0.3,
    },
    cardContent: {
      p: isMobile ? 1.5 : 2,
      pt: isMobile ? 2.5 : 3,
      flex: 1,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      mb: 2,
    },
    coupleAvatar: {
      width: isMobile ? 40 : 48,
      height: isMobile ? 40 : 48,
      bgcolor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.error.main, 0.2)
        : alpha(theme.palette.error.main, 0.1),
      fontSize: isMobile ? '1.2rem' : '1.5rem',
      flexShrink: 0,
    },
    coupleInfo: {
      flex: 1,
      minWidth: 0,
    },
    coupleName: {
      fontWeight: 600,
      fontSize: isMobile ? '0.95rem' : '1rem',
      color: theme.palette.text.primary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    typeChip: {
      mt: 0.5,
      height: 22,
      '& .MuiChip-label': {
        px: 1,
        fontSize: isMobile ? '0.6rem' : '0.65rem',
        fontWeight: 500,
      },
    },
    infoSection: {
      mb: 1.5,
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 1,
    },
    infoIcon: {
      fontSize: isMobile ? 16 : 18,
      color: theme.palette.text.secondary,
      flexShrink: 0,
    },
    infoText: {
      fontSize: isMobile ? '0.75rem' : '0.8rem',
      color: theme.palette.text.primary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    infoTextBold: {
      fontSize: isMobile ? '0.75rem' : '0.8rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    detailsGrid: {
      mb: 1.5,
    },
    detailItem: {
      bgcolor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.1)
        : theme.palette.action.hover,
      borderRadius: 1.5,
      p: 0.75,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    detailLabel: {
      fontSize: isMobile ? '0.55rem' : '0.6rem',
      color: theme.palette.text.secondary,
      display: 'block',
      mb: 0.25,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    detailValue: {
      fontSize: isMobile ? '0.7rem' : '0.75rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    notesBox: {
      bgcolor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.grey[700], 0.2)
        : theme.palette.grey[50],
      borderRadius: 1.5,
      p: 1,
      mt: 1.5,
    },
    notesLabel: {
      fontSize: '0.6rem',
      color: theme.palette.text.secondary,
      display: 'block',
      mb: 0.25,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    notesText: {
      fontSize: isMobile ? '0.7rem' : '0.75rem',
      color: theme.palette.text.secondary,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      lineHeight: 1.4,
    },
    actions: {
      p: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 0.25,
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
    },
    actionBtn: {
      minWidth: isMobile ? 40 : 56,
      height: 28,
      textTransform: 'none',
      fontSize: isMobile ? '0.65rem' : '0.7rem',
      fontWeight: 500,
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    emptyState: {
      textAlign: 'center',
      py: 6,
      px: 2,
      bgcolor: theme.palette.background.paper,
      borderRadius: 2.5,
      border: `1px dashed ${theme.palette.divider}`,
    },
    emptyIcon: {
      fontSize: isMobile ? 40 : 48,
      color: theme.palette.text.secondary,
      mb: 1.5,
    },
    emptyTitle: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
      mb: 0.5,
    },
    emptyText: {
      fontSize: isMobile ? '0.75rem' : '0.8rem',
      color: theme.palette.text.secondary,
    },
  };

  return (
    <Box>
      <AnimatePresence>
        <Grid container spacing={isMobile ? 1.5 : 2}>
          {safeEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                style={{ height: '100%' }}
              >
                <Card sx={styles.card}>
                  {/* Wedding Badge */}
                  {event.type === 'wedding' && (
                    <Box sx={styles.weddingBadge}>
                      <Favorite sx={styles.heartIcon} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: isMobile ? '0.55rem' : '0.6rem', 
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                        }}
                      >
                        JUST MARRIED
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={styles.cardContent}>
                    {/* Header with Couple Names */}
                    <Box sx={styles.header}>
                      <Avatar sx={styles.coupleAvatar}>
                        <span>{getMarriageIcon(event.type)}</span>
                      </Avatar>
                      <Box sx={styles.coupleInfo}>
                        <Typography sx={styles.coupleName}>
                          {event.name}
                        </Typography>
                        <Chip
                          label={getMarriageType(event.type)}
                          size="small"
                          color={getMarriageColor(event.type)}
                          sx={styles.typeChip}
                        />
                      </Box>
                    </Box>

                    {/* Client/Groom Info */}
                    <Box sx={styles.infoSection}>
                      <Box sx={styles.infoRow}>
                        <People sx={styles.infoIcon} />
                        <Typography sx={styles.infoText}>
                          <strong>Client:</strong> {event.client}
                        </Typography>
                      </Box>

                      <Box sx={styles.infoRow}>
                        <CalendarToday sx={styles.infoIcon} />
                        <Typography sx={styles.infoText}>
                          <strong>Date:</strong> {format(new Date(event.date), 'dd MMM yyyy')}
                        </Typography>
                      </Box>

                      {event.location && (
                        <Box sx={styles.infoRow}>
                          <LocationOn sx={styles.infoIcon} />
                          <Typography sx={styles.infoText} noWrap>
                            <strong>Venue:</strong> {event.location}
                          </Typography>
                        </Box>
                      )}

                      {event.guestCount && (
                        <Box sx={styles.infoRow}>
                          <People sx={styles.infoIcon} />
                          <Typography sx={styles.infoText}>
                            <strong>Guests:</strong> {event.guestCount}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Wedding Details Grid */}
                    <Grid container spacing={0.5} sx={styles.detailsGrid}>
                      <Grid item xs={6}>
                        <Box sx={styles.detailItem}>
                          <Typography sx={styles.detailLabel}>
                            Type
                          </Typography>
                          <Typography sx={styles.detailValue}>
                            {event.type === 'wedding' ? 'Wedding' : 'Reception'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={styles.detailItem}>
                          <Typography sx={styles.detailLabel}>
                            Status
                          </Typography>
                          <Typography sx={{ ...styles.detailValue, color: theme.palette.success.main }}>
                            Confirmed
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Notes if any */}
                    {event.notes && (
                      <Box sx={styles.notesBox}>
                        <Typography sx={styles.notesLabel}>
                          Notes
                        </Typography>
                        <Typography sx={styles.notesText}>
                          {event.notes}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <Divider />

                  <CardActions sx={styles.actions}>
                    <Tooltip title="Edit Event">
                      <Button
                        size="small"
                        onClick={() => onEdit(event)}
                        startIcon={<Edit sx={{ fontSize: 14 }} />}
                        sx={styles.actionBtn}
                      >
                        {!isMobile && 'Edit'}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Event">
                      <Button
                        size="small"
                        onClick={() => onDelete(event.id)}
                        startIcon={<Delete sx={{ fontSize: 14 }} />}
                        sx={styles.actionBtn}
                      >
                        {!isMobile && 'Delete'}
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>

      {/* Empty State */}
      {safeEvents.length === 0 && (
        <Box sx={styles.emptyState}>
          <Favorite sx={styles.emptyIcon} />
          <Typography sx={styles.emptyTitle}>
            No Marriage Events
          </Typography>
          <Typography sx={styles.emptyText}>
            Add wedding or reception events to manage them
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MarriageTab;