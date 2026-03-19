import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Paper,
    CircularProgress,
    useTheme,
    useMediaQuery,
    alpha,
    Fade,
} from '@mui/material';
import { Warning, Save } from '@mui/icons-material';
import { safeFormat } from '../../utils/dateHelpers';

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    saving,
    deathDate,
    anniversaryDate
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Fade}
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 3,
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: 450,
                    bgcolor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.98)
                        : 'background.paper',
                },
            }}
        >
            <DialogTitle sx={{ 
                pb: 1,
                background: alpha(theme.palette.warning.main, 0.1),
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ 
                        bgcolor: alpha(theme.palette.warning.main, 0.1), 
                        color: 'warning.main',
                        width: 40,
                        height: 40,
                    }}>
                        <Warning />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Confirm Save
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Are you sure you want to save this death anniversary as a client record?
                </Typography>
                
                <Paper sx={{ 
                    p: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.05), 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        Death Date: {safeFormat(deathDate, 'dd MMM yyyy')}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                        Anniversary: {safeFormat(anniversaryDate, 'dd MMM yyyy')}
                    </Typography>
                </Paper>
            </DialogContent>
            
            <DialogActions sx={{ 
                p: 2, 
                pt: 0, 
                flexDirection: isMobile ? 'column' : 'row', 
                gap: 1,
            }}>
                <Button
                    fullWidth={isMobile}
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1,
                        height: 48,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    fullWidth={isMobile}
                    variant="contained"
                    onClick={onConfirm}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} /> : <Save />}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1,
                        height: 48,
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    }}
                >
                    {saving ? 'Saving...' : 'Confirm Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;