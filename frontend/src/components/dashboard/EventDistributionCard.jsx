import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  PieChart,
  MoreVert,
} from '@mui/icons-material';

const EventDistributionCard = ({ eventTypes }) => {
  const theme = useTheme();
  const totalEvents = eventTypes?.reduce((sum, type) => sum + type.count, 0) || 0;

  return (
    <Card
      sx={{
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'white',
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PieChart color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant="h6" sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}>
              Event Distribution
            </Typography>
          </Box>
        }
        subheader={
          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Total: {totalEvents}
          </Typography>
        }
        action={
          <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            <MoreVert fontSize="small" />
          </IconButton>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
        }}
      />

      <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
        {eventTypes.map((type, index) => {
          const percentage = totalEvents
            ? (type.count / totalEvents) * 100
            : 0;

          return (
            <Box
              key={type.name}
              sx={{
                mb: index < eventTypes.length - 1 ? 1.5 : 0,
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.5,
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: type.color,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.8rem',
                    }}
                  >
                    {type.name}
                  </Typography>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}
                  >
                    {type.count}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.65rem' }}
                  >
                    ({percentage.toFixed(0)}%)
                  </Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: type.color,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EventDistributionCard;