import React from 'react';
import { Alert, Slide, alpha } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';

const AlertMessage = ({ open, type, message, onClose }) => {
    const icons = {
        success: <CheckCircle />,
        error: <Error />,
    };

    return (
        <Slide direction="down" in={open}>
            <Alert
                severity={type}
                sx={{
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette[type].main, 0.2)}`,
                }}
                onClose={onClose}
                icon={icons[type]}
            >
                {message}
            </Alert>
        </Slide>
    );
};

export default AlertMessage;