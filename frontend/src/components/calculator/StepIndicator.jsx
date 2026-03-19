import React from 'react';
import { Avatar, Typography, Box, Chip, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Check, Circle } from '@mui/icons-material';

// Helper function to safely get color from theme
const getThemeColor = (theme, color, defaultColor = 'primary') => {
    if (!color) return theme.palette[defaultColor].main;
    
    // Check if color exists in theme palette
    if (theme.palette[color]) {
        return theme.palette[color].main;
    }
    
    // Return the color as is if it's a valid color string
    return color;
};

// Main StepIndicator Component
const StepIndicator = ({ index, activeStep, color = 'primary', icon, completed }) => {
    const isActive = activeStep === index;
    const isCompleted = activeStep > index || completed;

    const getStatusColor = (theme) => {
        if (isCompleted) return theme.palette.success.main;
        if (isActive) return getThemeColor(theme, color);
        return alpha(theme.palette.text?.disabled || '#999', 0.3);
    };

    const getBackgroundColor = (theme) => {
        if (isCompleted) return alpha(theme.palette.success?.main || '#4caf50', 0.15);
        if (isActive) return alpha(getThemeColor(theme, color), 0.15);
        return alpha(theme.palette.text?.disabled || '#999', 0.05);
    };

    const getIcon = () => {
        if (isCompleted) return <Check sx={{ fontSize: { xs: 14, sm: 16 } }} />;
        if (isActive) return icon;
        return <Circle sx={{ fontSize: { xs: 8, sm: 10 } }} />;
    };

    return (
        <Avatar
            sx={(theme) => {
                const statusColor = getStatusColor(theme);
                const bgColor = getBackgroundColor(theme);
                
                return {
                    width: { xs: 32, sm: 36, md: 40 },
                    height: { xs: 32, sm: 36, md: 40 },
                    bgcolor: bgColor,
                    color: statusColor,
                    border: '2px solid',
                    borderColor: statusColor,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive 
                        ? `0 8px 16px ${alpha(statusColor, 0.25)}`
                        : isCompleted
                        ? `0 4px 12px ${alpha(theme.palette.success?.main || '#4caf50', 0.2)}`
                        : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                };
            }}
        >
            {getIcon()}
        </Avatar>
    );
};

// Label Component
StepIndicator.Label = ({ label, description, isMobile = false, isActive = false, isCompleted = false, color = 'primary' }) => {
    return (
        <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography 
                    variant="body2" 
                    fontWeight={isActive ? 700 : 600}
                    sx={(theme) => ({
                        color: isCompleted 
                            ? theme.palette.success?.main || '#4caf50'
                            : isActive 
                                ? 'text.primary' 
                                : 'text.secondary',
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                        lineHeight: 1.2,
                        transition: 'color 0.2s ease',
                    })}
                >
                    {label}
                </Typography>
                {isActive && !isMobile && (
                    <Chip
                        label="Current"
                        size="small"
                        sx={(theme) => ({
                            height: 18,
                            bgcolor: alpha(getThemeColor(theme, color), 0.1),
                            color: getThemeColor(theme, color),
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 0.8 },
                        })}
                    />
                )}
                {isCompleted && !isMobile && (
                    <Chip
                        label="Done"
                        size="small"
                        sx={(theme) => ({
                            height: 18,
                            bgcolor: alpha(theme.palette.success?.main || '#4caf50', 0.1),
                            color: theme.palette.success?.main || '#4caf50',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 0.8 },
                        })}
                    />
                )}
            </Box>
            {!isMobile && description && (
                <Typography 
                    variant="caption" 
                    sx={(theme) => ({
                        color: isActive ? 'text.secondary' : 'text.disabled',
                        display: 'block',
                        mt: 0.25,
                        fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                        lineHeight: 1.3,
                        maxWidth: 200,
                    })}
                >
                    {description}
                </Typography>
            )}
        </Box>
    );
};

// Description Component
StepIndicator.Description = ({ description }) => {
    return (
        <Paper
            elevation={0}
            sx={(theme) => ({
                display: 'inline-block',
                px: 1,
                py: 0.5,
                bgcolor: alpha(theme.palette.primary?.main || '#1976d2', 0.05),
                borderRadius: 1,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary?.main || '#1976d2', 0.1),
                mt: 0.5,
            })}
        >
            <Typography 
                variant="caption" 
                sx={(theme) => ({
                    color: 'text.secondary',
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                })}
            >
                <Circle sx={(theme) => ({ 
                    fontSize: 6, 
                    color: theme.palette.primary?.main || '#1976d2',
                })} />
                {description}
            </Typography>
        </Paper>
    );
};

// Connector Component
StepIndicator.Connector = ({ active = false, completed = false, color = 'primary' }) => {
    return (
        <Box
            sx={(theme) => {
                const connectorColor = completed 
                    ? (theme.palette.success?.main || '#4caf50')
                    : active 
                        ? getThemeColor(theme, color)
                        : alpha(theme.palette.divider || '#ddd', 0.3);
                
                return {
                    flex: 1,
                    height: 2,
                    mx: { xs: 0.5, sm: 1 },
                    background: `linear-gradient(90deg, ${connectorColor} 0%, ${alpha(connectorColor, 0.3)} 100%)`,
                    borderRadius: 1,
                    position: 'relative',
                    ...(completed && {
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: -3,
                            right: -2,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: theme.palette.success?.main || '#4caf50',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%': { opacity: 1, transform: 'scale(1)' },
                                '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                                '100%': { opacity: 1, transform: 'scale(1)' },
                            },
                        },
                    }),
                };
            }}
        />
    );
};

// Card Component
StepIndicator.Card = ({ step, index, activeStep, color = 'primary', icon, onClick }) => {
    const isActive = activeStep === index;
    const isCompleted = activeStep > index;

    return (
        <Paper
            elevation={isActive ? 3 : 0}
            onClick={onClick}
            sx={(theme) => ({
                p: 1.5,
                borderRadius: 2,
                bgcolor: isActive 
                    ? alpha(getThemeColor(theme, color), 0.05)
                    : 'transparent',
                border: '1px solid',
                borderColor: isActive 
                    ? alpha(getThemeColor(theme, color), 0.3)
                    : alpha(theme.palette.divider || '#ddd', 0.1),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': {
                    bgcolor: alpha(getThemeColor(theme, color), 0.02),
                    borderColor: alpha(getThemeColor(theme, color), 0.2),
                },
            })}
        >
            <StepIndicator
                index={index}
                activeStep={activeStep}
                color={color}
                icon={icon}
                completed={isCompleted}
            />
            <Box sx={{ flex: 1 }}>
                <Typography 
                    variant="body2" 
                    fontWeight={isActive ? 700 : 500}
                    sx={(theme) => ({
                        color: isActive ? 'text.primary' : 'text.secondary',
                    })}
                >
                    {step?.label || ''}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{
                        color: 'text.disabled',
                        display: 'block',
                        fontSize: '0.6rem',
                    }}
                >
                    {step?.description || ''}
                </Typography>
            </Box>
            {isCompleted && (
                <Check sx={(theme) => ({ 
                    fontSize: 16, 
                    color: theme.palette.success?.main || '#4caf50',
                })} />
            )}
        </Paper>
    );
};

export default StepIndicator;