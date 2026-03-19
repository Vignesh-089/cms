import React from 'react';
import { Box, Typography, Avatar, IconButton, Button, Zoom, useTheme, alpha } from '@mui/material';
import { ArrowBack, Calculate, Refresh } from '@mui/icons-material';

const BackHeader = ({ title, subtitle, onBack, showReset, onReset }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 2, sm: 3 },
            flexWrap: 'wrap',
            gap: 2,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <IconButton 
                    onClick={onBack} 
                    sx={{ 
                        mr: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                        },
                    }}
                >
                    <ArrowBack />
                </IconButton>
                <Avatar sx={{
                    bgcolor: theme.palette.primary.main,
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}>
                    <Calculate />
                </Avatar>
                <Box>
                    <Typography sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        color: 'text.primary',
                    }}>
                        {title}
                    </Typography>
                    <Typography sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                        mt: 0.25,
                    }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
            
            {showReset && (
                <Zoom in={true}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onReset}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: { xs: 2, sm: 3 },
                            py: 1,
                            height: { xs: 40, sm: 48 },
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            color: 'primary.main',
                        }}
                    >
                        New Calculation
                    </Button>
                </Zoom>
            )}
        </Box>
    );
};

export default BackHeader;