import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Today,
  Print,
  Download,
  FilterList,
} from '@mui/icons-material';

const CalendarHeader = ({ 
  title, 
  subtitle, 
  onToday, 
  onPrint, 
  onExport, 
  onFilterToggle,
  isMobile 
}) => {
  const theme = useTheme();

  // Mobile-specific styles
  if (isMobile) {
    return (
      <Box sx={{ mb: 2 }}>
        {/* Top row with title and filter */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1,
        }}>
          <Typography sx={{ 
            fontSize: '1.1rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onFilterToggle && (
              <Tooltip title="Filter Events">
                <IconButton 
                  onClick={onFilterToggle}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <FilterList fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Today">
              <Button 
                variant="outlined" 
                size="small"
                onClick={onToday}
                sx={{ 
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                }}
              >
                Today
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Subtitle - simplified for mobile */}
        {subtitle && (
          <Typography sx={{ 
            fontSize: '0.7rem',
            color: theme.palette.text.secondary,
            mb: 1.5,
          }}>
            {subtitle.length > 50 ? `${subtitle.substring(0, 50)}...` : subtitle}
          </Typography>
        )}

        {/* Action buttons row - scrollable if needed */}
        <Box sx={{ 
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 0.5,
          '&::-webkit-scrollbar': {
            height: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.2)' 
              : 'rgba(0,0,0,0.2)',
            borderRadius: 1,
          },
        }}>
          <Tooltip title="Print">
            <IconButton 
              onClick={onPrint}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                flexShrink: 0,
              }}
            >
              <Print fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Export">
            <IconButton 
              onClick={onExport}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                flexShrink: 0,
              }}
            >
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }

  // Desktop version (unchanged but optimized)
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3,
      flexWrap: 'wrap',
      gap: 2,
    }}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ 
          fontSize: '2rem',
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ 
            fontSize: '0.9rem',
            color: theme.palette.text.secondary,
            mt: 0.5,
          }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'flex',
        gap: 1,
        alignItems: 'center',
      }}>
        {onFilterToggle && (
          <Tooltip title="Filter Events">
            <IconButton onClick={onFilterToggle}>
              <FilterList />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Print">
          <IconButton onClick={onPrint}>
            <Print />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Export">
          <IconButton onClick={onExport}>
            <Download />
          </IconButton>
        </Tooltip>
        
        <Button 
          variant="outlined" 
          startIcon={<Today />}
          onClick={onToday}
          sx={{ ml: 1 }}
        >
          Today
        </Button>
      </Box>
    </Box>
  );
};

export default CalendarHeader;