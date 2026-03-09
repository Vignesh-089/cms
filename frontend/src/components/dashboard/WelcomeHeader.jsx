import React from 'react';
import { Box, Typography, Paper, Avatar, useTheme } from '@mui/material';
import { Celebration, WbSunny, Nightlight } from '@mui/icons-material';
import { format } from 'date-fns';

const WelcomeHeader = () => {
  const theme = useTheme();
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingIcon = () => {
    if (currentHour < 12) return <WbSunny />;
    if (currentHour < 17) return <Celebration />;
    return <Nightlight />;
  };

  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        mb: { xs: 2, sm: 3, md: 4 },
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        color: 'white',
        borderRadius: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements - hidden on mobile for cleaner look */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: { xs: 0, sm: 150, md: 200 },
          height: { xs: 0, sm: 150, md: 200 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: { xs: 0, sm: 200, md: 250 },
          height: { xs: 0, sm: 200, md: 250 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Top row with icon and greeting */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          mb: 1,
        }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: { xs: 40, sm: 48, md: 56 },
              height: { xs: 40, sm: 48, md: 56 },
            }}
          >
            {React.cloneElement(getGreetingIcon(), { 
              sx: { fontSize: { xs: 20, sm: 24, md: 28 } }
            })}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                lineHeight: 1.2,
                mb: 0.25,
              }}
            >
              {getGreeting()}!
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                display: 'block',
                lineHeight: 1.2,
              }}
            >
              {currentDate}
            </Typography>
          </Box>
        </Box>

        {/* Welcome message - more compact on mobile */}
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.9,
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
            lineHeight: 1.4,
            pl: { xs: 0, sm: 0.5 },
            borderLeft: { xs: 'none', sm: `2px solid rgba(255, 255, 255, 0.3)` },
            pl: { sm: 1.5 },
          }}
        >
          Welcome back to your calendar system.
          <Box component="span" sx={{ 
            display: { xs: 'inline', sm: 'block' },
            ml: { xs: 0.5, sm: 0 },
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: { xs: 'normal', sm: 500 },
          }}>
            {` ${getEventsSummary()}`}
          </Box>
        </Typography>
      </Box>
    </Paper>
  );
};

// Helper function to get dynamic event summary
const getEventsSummary = () => {
  const eventCount = 24; // This would come from props/context in real app
  const alertCount = 18;
  
  if (eventCount > 0) {
    return `You have ${eventCount} events today.`;
  }
  return 'No events scheduled for today.';
};

export default WelcomeHeader;