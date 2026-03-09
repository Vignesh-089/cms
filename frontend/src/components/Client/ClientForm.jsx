import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    useTheme,
    useMediaQuery,
    alpha,
    Fade,
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Notes as NotesIcon,
    Group as GroupIcon,
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Work as WorkIcon,
    CalendarToday as CalendarIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { saveClient, fetchClientById } from "../../services/clientService";

const ClientMaster = ({ setIsListView, selectedClient }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';

    const isEditMode = Boolean(selectedClient);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

    // Form state with corrected names
    const [formData, setFormData] = useState({
        full_name: '',
        clientName: '',
        eventDate: '',
        eventType: '',
        customEventName: '',
        phone_number: '',
        occupation: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: '',
        alternative_phone: '',
        anniversary_date: '',
        is_active: true,
    });

    // Form validation errors
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Load client data if in edit mode
    useEffect(() => {
        if (isEditMode && selectedClient) {
            loadClientData();
        }
    }, [isEditMode, selectedClient]);

    const loadClientData = async () => {
        try {
            setLoading(true);
            const res = await fetchClientById(selectedClient.id);

            if (res.data.success) {
                setFormData(res.data.data);
            }
        } catch (err) {
            setError("Failed to load client");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateField(name);
    };

    const validateField = (fieldName) => {
        const value = formData[fieldName];
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'full_name':
                if (!value?.trim()) {
                    newErrors.full_name = 'Full name is required';
                } else if (value.trim().length < 3) {
                    newErrors.full_name = 'Name must be at least 3 characters';
                } else {
                    delete newErrors.full_name;
                }
                break;

            case 'clientName':
                if (!value?.trim()) {
                    newErrors.clientName = 'Client name is required';
                } else if (value.trim().length < 2) {
                    newErrors.clientName = 'Client name must be at least 2 characters';
                } else {
                    delete newErrors.clientName;
                }
                break;

            case 'eventDate':
                if (!value?.trim()) {
                    newErrors.eventDate = 'Event date is required';
                } else {
                    delete newErrors.eventDate;
                }
                break;

            case 'eventType':
                if (!value?.trim()) {
                    newErrors.eventType = 'Event type is required';
                } else {
                    delete newErrors.eventType;
                }
                break;

            case 'customEventName':
                if (formData.eventType === "Others" && !value?.trim()) {
                    newErrors.customEventName = 'Please enter event name';
                } else {
                    delete newErrors.customEventName;
                }
                break;

            case 'phone_number':
                if (!value?.trim()) {
                    newErrors.phone_number = 'Phone number is required';
                } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(value.trim())) {
                    newErrors.phone_number = 'Enter a valid phone number';
                } else {
                    delete newErrors.phone_number;
                }
                break;

            case 'address':
                if (!value?.trim()) {
                    newErrors.address = 'Address is required';
                } else {
                    delete newErrors.address;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const fields = ['full_name', 'clientName', 'eventDate', 'phone_number', 'address'];
        fields.forEach(field => validateField(field));
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allFields = ['full_name', 'clientName', 'eventDate', 'phone_number', 'address'];
        const touchedFields = {};
        allFields.forEach(field => touchedFields[field] = true);
        setTouched(touchedFields);

        allFields.forEach(field => validateField(field));

        if (Object.keys(errors).length > 0) return;

        setSaving(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                event_type:
                    formData.eventType === "Others"
                        ? formData.customEventName
                        : formData.eventType,
                custom_event_name:
                    formData.eventType === "Others"
                        ? formData.customEventName
                        : null,
                id: isEditMode ? selectedClient.id : undefined
            };

            delete payload.eventType;
            delete payload.customEventName;

            const res = await saveClient(payload);

            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    setIsListView(true);
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save client");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (Object.values(formData).some(value => value !== '')) {
            setOpenCancelDialog(true);
        } else {
            setIsListView(true);
        }
    };

    const handleBack = () => {
        setIsListView(true);
    };

    if (loading) {
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
                <CircularProgress size={60} thickness={4} />
                <Typography variant="body1" color="text.secondary">
                    Loading client data...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
                width: '100%',
                maxWidth: '100%',
                p: { xs: 1.5, sm: 2, md: 3 },
                minHeight: '100vh',
                bgcolor: isDarkMode
                    ? alpha(theme.palette.common.black, 0.96)
                    : theme.palette.grey[50],
            }}
        >
            {/* Back Button - Minimal Header */}
            <Box sx={{ mb: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        color: theme.palette.primary.main,
                    }}
                >
                    Back
                </Button>
            </Box>

            {/* Alerts */}
            <AnimatePresence>
                {success && (
                    <Fade in timeout={500}>
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                backdropFilter: 'blur(10px)',
                                bgcolor: isDarkMode ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.2),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.success.main, 0.3),
                            }}
                            onClose={() => setSuccess(false)}
                            icon={<CheckCircleIcon />}
                        >
                            <Typography variant="body2" fontWeight={500}>
                                Client {isEditMode ? 'updated' : 'added'} successfully! Redirecting...
                            </Typography>
                        </Alert>
                    </Fade>
                )}

                {error && (
                    <Fade in timeout={500}>
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                backdropFilter: 'blur(10px)',
                                bgcolor: isDarkMode ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.error.light, 0.2),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.error.main, 0.3),
                            }}
                            onClose={() => setError(null)}
                            icon={<ErrorIcon />}
                        >
                            {error}
                        </Alert>
                    </Fade>
                )}
            </AnimatePresence>

            {/* Main Form - All Fields in One Card */}
            <form onSubmit={handleSubmit}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                        borderRadius: 2,
                        bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.8) : 'background.paper',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        {isEditMode ? <EditIcon /> : <PersonIcon />}
                        {isEditMode ? 'Edit Client' : 'Add New Client'}
                    </Typography>

                    <Grid container spacing={2}>
                        {/* Row 1: 4 fields */}
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                required
                                label="Full Name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.full_name && !!errors.full_name}
                                helperText={touched.full_name && errors.full_name}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                required
                                label="Client Name/Relation"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.clientName && !!errors.clientName}
                                helperText={touched.clientName && errors.clientName}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    },
                                }}
                            />
                        </Grid>

                        {/* Event Type */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl
                                fullWidth
                                required
                                size="small"
                                error={touched.eventType && !!errors.eventType}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5,
                                        height: 48,
                                        width: 200,
                                        bgcolor: isDarkMode
                                            ? alpha(theme.palette.common.white, 0.05)
                                            : 'transparent',
                                    },
                                }}
                            >
                                <InputLabel>Event Type</InputLabel>
                                <Select
                                    name="eventType"
                                    value={formData.eventType}
                                    label="Event Type"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <MenuItem value="Marriage">Marriage</MenuItem>
                                    <MenuItem value="Death Anniversary">Death Anniversary</MenuItem>
                                    <MenuItem value="House Warming">House Warming</MenuItem>
                                    <MenuItem value="Reception">Reception</MenuItem>
                                    <MenuItem value="Temple Function">Temple Function</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Custom Event Name Field */}
                        {formData.eventType === "Others" && (
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Enter Event Name"
                                    name="customEventName"
                                    value={formData.customEventName}
                                    onChange={handleChange}
                                    size="small"
                                    InputProps={{
                                        sx: {
                                            borderRadius: 1.5,
                                            height: 48,
                                            bgcolor: isDarkMode
                                                ? alpha(theme.palette.common.white, 0.05)
                                                : 'transparent',
                                        },
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                required
                                label="Date"
                                name="eventDate"
                                type="date"
                                value={formData.eventDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.eventDate && !!errors.eventDate}
                                helperText={touched.eventDate && errors.eventDate}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        width: 200,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                required
                                label="Phone Number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.phone_number && !!errors.phone_number}
                                helperText={touched.phone_number && errors.phone_number}
                                size="small"
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.address && !!errors.address}
                                helperText={touched.address && errors.address}
                                multiline
                                rows={2}
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        bgcolor: isDarkMode
                                            ? alpha(theme.palette.common.white, 0.05)
                                            : "transparent",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Row 3: 4 fields */}
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                size="small"
                                placeholder="Add notes..."
                                InputProps={{
                                    sx: {
                                        borderRadius: 1.5,
                                        height: 48,
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : 'transparent',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Form Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'flex-end',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                        disabled={saving}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            px: { xs: 0, sm: 4 },
                            py: { xs: 1, sm: 0.75 },
                            width: { xs: '100%', sm: 'auto' },
                            order: { xs: 2, sm: 1 },
                            height: 48,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />}
                        disabled={saving}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            px: { xs: 0, sm: 4 },
                            py: { xs: 1, sm: 0.75 },
                            width: { xs: '100%', sm: 'auto' },
                            order: { xs: 1, sm: 2 },
                            height: 48,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        }}
                    >
                        {saving ? 'Saving...' : isEditMode ? 'Update Client' : 'Save Client'}
                    </Button>
                </Box>
            </form>

            {/* Cancel Dialog */}
            <Dialog
                open={openCancelDialog}
                onClose={() => setOpenCancelDialog(false)}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        width: isMobile ? '90%' : 'auto',
                        maxWidth: 400,
                        bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.95) : 'background.paper',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', width: 32, height: 32 }}>
                            <InfoIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Discard Changes?
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        You have unsaved changes. Are you sure you want to discard them?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                    <Button
                        fullWidth={isMobile}
                        variant="outlined"
                        onClick={() => setOpenCancelDialog(false)}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            py: 0.75,
                            height: 48,
                        }}
                    >
                        Continue Editing
                    </Button>
                    <Button
                        fullWidth={isMobile}
                        variant="contained"
                        onClick={() => setIsListView(true)}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            py: 0.75,
                            height: 48,
                            bgcolor: 'warning.main',
                            '&:hover': { bgcolor: 'warning.dark' },
                        }}
                    >
                        Discard Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientMaster;