import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

const StatsCard = ({ title, value, icon, color, change, trend }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'white',
        boxShadow: theme.shadows[2],
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        {/* Ultra compact layout */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          mb: 1,
        }}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 36,
              height: 36,
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: 18 }
            })}
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.5,
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1rem',
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>
              <Chip
                label={change}
                size="small"
                color={trend === 'up' ? 'success' : 'error'}
                icon={trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                sx={{
                  height: 20,
                  '& .MuiChip-label': {
                    fontSize: '0.6rem',
                    px: 0.75,
                  },
                  '& .MuiChip-icon': {
                    fontSize: 10,
                    ml: 0.25,
                  },
                }}
              />
            </Box>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{
                fontSize: '0.65rem',
                lineHeight: 1.2,
                display: 'block',
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={75}
          sx={{
            height: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatsCard;