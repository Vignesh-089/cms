import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const Loader = ({ message = 'Loading...' }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <CircularProgress
                size={60}
                thickness={4}
                sx={{
                    color: theme.palette.primary.main,
                }}
            />
            <Typography
                variant="body1"
                sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default Loader;