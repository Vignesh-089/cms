import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Box,
  Typography,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  Paper,
  alpha,
} from '@mui/material';
import {
  MoreVert,
  Event,
  Schedule,
  Close,
  Visibility,
} from '@mui/icons-material';

// Transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getPriorityColor = (priority, theme) => {
  switch (priority) {
    case 'high':
      return theme.palette.error.main;
    case 'medium':
      return theme.palette.warning.main;
    case 'low':
      return theme.palette.success.main;
    default:
      return theme.palette.primary.main;
  }
};

const EventsList = ({ events, maxItems, showAll, theme, onViewAll }) => {
  const displayEvents = showAll ? events : events.slice(0, maxItems);
  
  return (
    <List sx={{ p: 0 }}>
      {displayEvents.map((event, index) => (
        <React.Fragment key={event.id}>
          <ListItem
            sx={{
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1.5, sm: 2 },
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.02),
              },
            }}
          >
            <ListItemAvatar sx={{ minWidth: { xs: 36, sm: 56 } }}>
              <Avatar
                sx={{
                  bgcolor: getPriorityColor(event.priority, theme),
                  color: 'white',
                  width: { xs: 28, sm: 40 },
                  height: { xs: 28, sm: 40 },
                  fontSize: { xs: '0.8rem', sm: '1.1rem' },
                }}
              >
                {event.type.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            
            <ListItemText
              primary={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.95rem' },
                    lineHeight: 1.2,
                    mb: 0.25
                  }}
                >
                  {event.client}
                </Typography>
              }
              secondary={
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {event.type}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      display: { xs: 'none', xs: 'inline' }
                    }}
                  >
                    •
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {event.date}
                  </Typography>
                </Box>
              }
              sx={{ 
                m: 0,
                flex: '1 1 auto',
              }}
            />
            
            <Chip
              icon={<Schedule sx={{ fontSize: { xs: 10, sm: 14 } }} />}
              label={`${event.daysLeft}d`}
              size="small"
              sx={{
                bgcolor: getPriorityColor(event.priority, theme),
                color: 'white',
                fontWeight: 600,
                height: { xs: 20, sm: 28 },
                minWidth: { xs: 45, sm: 65 },
                '& .MuiChip-label': {
                  fontSize: { xs: '0.6rem', sm: '0.7rem' },
                  px: { xs: 0.5, sm: 1.5 }
                },
                '& .MuiChip-icon': {
                  color: 'white',
                  fontSize: { xs: 10, sm: 14 },
                  ml: { xs: 0.25, sm: 0.75 },
                  mr: { xs: -0.25, sm: 0 }
                },
              }}
            />
          </ListItem>
          {index < displayEvents.length - 1 && (
            <Divider 
              variant="fullWidth" 
              component="li" 
              sx={{ 
                mx: { xs: 1.5, sm: 2 },
                width: 'auto'
              }} 
            />
          )}
        </React.Fragment>
      ))}
      
      {/* Show "View All" button if there are more items and not showing all */}
      {!showAll && events.length > maxItems && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ p: { xs: 1, sm: 2 }, textAlign: 'center' }}>
            <Button
              variant="text"
              color="primary"
              onClick={onViewAll}
              startIcon={<Visibility />}
              size="small"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                textTransform: 'none',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              View All ({events.length - maxItems} more)
            </Button>
          </Box>
        </>
      )}
    </List>
  );
};

const UpcomingEventsCard = ({ events }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const maxInitialItems = 5;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Event color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
              <Typography variant="h6" sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}>
                Upcoming Events
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              Next 30 days
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={`${events.length} Events`}
                color="primary"
                size="small"
                sx={{ 
                  fontWeight: 600,
                  height: { xs: 24, sm: 32 },
                  '& .MuiChip-label': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    px: { xs: 1, sm: 1.5 }
                  }
                }}
              />
              <IconButton 
                size="small" 
                onClick={handleOpenDialog}
                sx={{ 
                  display: { xs: 'inline-flex' },
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.05),
                  },
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{
            p: { xs: 1.5, sm: 2 },
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            }
          }}
        />
        <Divider />
        <CardContent sx={{ p: { xs: 0, sm: 1 }, flex: 1 }}>
          <EventsList 
            events={events}
            maxItems={maxInitialItems}
            showAll={false}
            theme={theme}
            onViewAll={handleOpenDialog}
          />
        </CardContent>
      </Card>

      {/* Dialog/Modal for all events */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        fullWidth
        fullScreen={false}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none',
            borderRadius: { xs: 0, sm: 2 },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: 'calc(100% - 64px)' },
            height: { xs: '100%', sm: 'auto' },
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: { xs: 'flex-end', sm: 'center' },
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: { xs: 2, sm: 3 },
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.primary.dark, 0.2)
            : alpha(theme.palette.primary.light, 0.1),
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event color="primary" />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              All Upcoming Events
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseDialog}
            size="small"
            sx={{
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.05),
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 0, sm: 2 } }}>
          <DialogContentText component="div">
            <Box sx={{ 
              maxHeight: { xs: 'calc(100vh - 120px)', sm: '500px' },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.05),
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.2)
                  : alpha(theme.palette.common.black, 0.2),
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.3)
                    : alpha(theme.palette.common.black, 0.3),
                },
              },
            }}>
              <EventsList 
                events={events}
                maxItems={events.length}
                showAll={true}
                theme={theme}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          borderTop: `1px solid ${theme.palette.divider}`,
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            fullWidth={false}
            sx={{
              minWidth: { xs: '100%', sm: '120px' },
              textTransform: 'none',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpcomingEventsCard;