import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Grid,
    Menu,
    MenuItem,
    Tooltip,
    Badge,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Stack,
    alpha,
    Fade,
    Zoom,
    Fab,
    Divider,
    ListItemIcon,
    ListItemText,
    BottomNavigation,
    BottomNavigationAction,
    SwipeableDrawer,
    CircularProgress,
    Alert,
    Collapse,
} from '@mui/material';
import {
    Search,
    Add,
    Edit,
    Delete,
    Visibility,
    Phone,
    Email,
    LocationOn,
    FilterList,
    Download,
    CalendarToday,
    Group,
    Close,
    CheckCircle,
    Refresh,
    ArrowUpward,
    ArrowDownward,
    FilterAlt,
    MoreVert,
    Person,
    Work,
    Notes,
    Info,
    ArrowBack,
    ViewModule,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllClients, removeClient } from "../../services/clientService";

const ClientsListView = ({ setIsListView, setSelectedClient }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedClient, setSelectedClientLocal] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('full_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);
    const [mobileFilterDrawer, setMobileFilterDrawer] = useState(false);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState([]);

    // Update rowsPerPage when mobile view changes
    useEffect(() => {
        setRowsPerPage(isMobile ? 5 : 10);
    }, [isMobile]);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            const res = await fetchAllClients();

            if (res.data.success) {
                setClients(res.data.data);
            }
        } catch (err) {
            setError("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditClient = (client) => {
        setSelectedClientLocal(client);
        setSelectedClient(client);
        setIsListView(false);
    };

    const handleAddClient = () => {
        setSelectedClient(null);
        setIsListView(false);
    };

    const handleDeleteClick = (client) => {
        setSelectedClientLocal(client);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);

            const res = await removeClient(selectedClient.id);

            if (res.data.success) {
                setClients(prev => prev.filter(c => c.id !== selectedClient.id));
                setSuccess(true);
                setOpenDeleteDialog(false);
                setSelectedClientLocal(null);
            }
        } catch (err) {
            setError("Failed to delete client");
        } finally {
            setLoading(false);
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Filtering and sorting
    const filteredClients = clients
        .filter(client => {
            const matchesSearch =
                client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.phone_number?.includes(searchTerm) ||
                client.city?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        })
        .sort((a, b) => {
            const order = sortOrder === 'asc' ? 1 : -1;
            
            switch (sortBy) {
                case 'full_name':
                    return (a.full_name || '').localeCompare(b.full_name || '') * order;
                case 'clientName':
                    return (a.clientName || '').localeCompare(b.clientName || '') * order;
                case 'eventDate':
                    return (new Date(a.eventDate || 0) - new Date(b.eventDate || 0)) * order;
                case 'city':
                    return (a.city || '').localeCompare(b.city || '') * order;
                default:
                    return 0;
            }
        });

    // Statistics
    const totalClients = clients.length;
    const clientsWithEvents = clients.filter(c => c.eventDate).length;
    const upcomingEvents = clients.filter(c => {
        if (!c.eventDate) return false;
        return new Date(c.eventDate) > new Date();
    }).length;

    // Mobile Filter Drawer Content
    const MobileFilterDrawer = () => (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Sort By
                </Typography>
                <IconButton onClick={() => setMobileFilterDrawer(false)}>
                    <Close />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
                {[
                    { value: 'full_name', label: 'Full Name' },
                    { value: 'clientName', label: 'Client Name' },
                    { value: 'eventDate', label: 'Event Date' },
                    { value: 'city', label: 'City' },
                ].map((option) => (
                    <Button
                        key={option.value}
                        fullWidth
                        variant={sortBy === option.value ? 'contained' : 'outlined'}
                        onClick={() => {
                            if (sortBy === option.value) {
                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            } else {
                                setSortBy(option.value);
                                setSortOrder('asc');
                            }
                            setMobileFilterDrawer(false);
                        }}
                        sx={{
                            justifyContent: 'space-between',
                            textTransform: 'none',
                            borderRadius: 1.5,
                            height: 44,
                        }}
                        endIcon={sortBy === option.value && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
                    >
                        {option.label}
                    </Button>
                ))}
            </Stack>
        </Box>
    );

    if (loading && !openDeleteDialog) {
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
                    Loading clients...
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
                pb: isMobile ? 10 : 3,
            }}
        >
            {/* Alerts */}
            <AnimatePresence>
                {success && (
                    <Fade in timeout={500}>
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: 1.5,
                                backdropFilter: 'blur(10px)',
                                bgcolor: isDarkMode ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.2),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.success.main, 0.3),
                            }}
                            onClose={() => setSuccess(false)}
                            icon={<CheckCircle />}
                        >
                            <Typography variant="body2" fontWeight={500}>
                                Client deleted successfully!
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
                                borderRadius: 1.5,
                                backdropFilter: 'blur(10px)',
                                bgcolor: isDarkMode ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.error.light, 0.2),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.error.main, 0.3),
                            }}
                            onClose={() => setError(null)}
                            icon={<Info />}
                        >
                            {error}
                        </Alert>
                    </Fade>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: 2,
                    background: isDarkMode
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                        : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: isDarkMode
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.primary.main, 0.1),
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: { xs: 48, sm: 56 },
                                height: { xs: 48, sm: 56 },
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 3,
                            }}
                        >
                            <Group sx={{ fontSize: { xs: 24, sm: 28 }, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography
                                variant={isMobile ? "h5" : "h4"}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.25rem', sm: '1.75rem' },
                                    background: isDarkMode
                                        ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
                                        : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Clients
                            </Typography>
                            {!isMobile && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Manage all your clients
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Desktop Add Button */}
                    {!isMobile && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddClient}
                            sx={{
                                px: 3,
                                py: 1,
                                borderRadius: 1.5,
                                textTransform: 'none',
                                height: 48,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            }}
                        >
                            Add New Client
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* Stats Cards - Improved for mobile */}
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isDarkMode ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.light, 0.1),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            Total
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {totalClients}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isDarkMode ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.1),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.2),
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            With Events
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {clientsWithEvents}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isDarkMode ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.warning.light, 0.1),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.warning.main, 0.2),
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            Upcoming
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {upcomingEvents}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Search and Filter Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: 2,
                    bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.8) : 'background.paper',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            placeholder={isMobile ? "Search by name, phone..." : "Search by name, email, phone, city..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 1.5,
                                    height: 48,
                                    fontSize: { xs: '0.95rem', sm: '0.9rem' },
                                },
                            }}
                        />
                    </Grid>

                    {!isMobile ? (
                        <Grid item xs={12} md={4}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterAlt />}
                                    onClick={(e) => setSortAnchorEl(e.currentTarget)}
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: 'none',
                                        height: 48,
                                        px: 2,
                                    }}
                                >
                                    Sort
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={loadClients}
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: 'none',
                                        height: 48,
                                        px: 2,
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Stack>
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<FilterAlt />}
                                    onClick={() => setMobileFilterDrawer(true)}
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: 'none',
                                        height: 48,
                                    }}
                                >
                                    Sort
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={loadClients}
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: 'none',
                                        height: 48,
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Desktop Sort Menu */}
            <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => setSortAnchorEl(null)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 220,
                        p: 1,
                    }
                }}
            >
                <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                    Sort By
                </Typography>
                {[
                    { value: 'full_name', label: 'Full Name' },
                    { value: 'clientName', label: 'Client Name' },
                    { value: 'eventDate', label: 'Event Date' },
                    { value: 'city', label: 'City' },
                ].map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={() => {
                            if (sortBy === option.value) {
                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            } else {
                                setSortBy(option.value);
                                setSortOrder('asc');
                            }
                            setSortAnchorEl(null);
                        }}
                        sx={{ borderRadius: 1, mx: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            {option.label}
                            {sortBy === option.value && (
                                sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                            )}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>

            {/* Mobile Filter Drawer */}
            <SwipeableDrawer
                anchor="bottom"
                open={mobileFilterDrawer}
                onClose={() => setMobileFilterDrawer(false)}
                onOpen={() => setMobileFilterDrawer(true)}
                disableSwipeToOpen={false}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        maxHeight: '85vh',
                    },
                }}
            >
                <MobileFilterDrawer />
            </SwipeableDrawer>

            {/* Mobile Card View - Clean design with icons and text only */}
            {isMobile ? (
                <Box>
                    <AnimatePresence>
                        {filteredClients
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((client, index) => (
                                <motion.div
                                    key={client.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            mb: 1.5,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.8) : 'background.paper',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        {/* Header with Name and Client Name */}
                                        <Box sx={{ mb: 1.5 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {client.full_name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {client.clientName}
                                            </Typography>
                                        </Box>

                                        {/* Event Date */}
                                        {client.eventDate && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CalendarToday sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                                                <Typography variant="body2">
                                                    Event: {formatDate(client.eventDate)}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Phone */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <Phone sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                                            <Typography variant="body2">
                                                {client.phone_number}
                                            </Typography>
                                        </Box>

                                        {/* Action Icons */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2,
                                            pt: 1,
                                            borderTop: '1px solid',
                                            borderColor: 'divider',
                                        }}>
                                            <Button
                                                size="small"
                                                startIcon={<Visibility fontSize="small" />}
                                                onClick={() => {}}
                                                sx={{ 
                                                    textTransform: 'none',
                                                    color: 'text.secondary',
                                                    minWidth: 'auto',
                                                    p: 0.5,
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<Edit fontSize="small" />}
                                                onClick={() => handleEditClient(client)}
                                                sx={{ 
                                                    textTransform: 'none',
                                                    color: 'primary.main',
                                                    minWidth: 'auto',
                                                    p: 0.5,
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<Delete fontSize="small" />}
                                                onClick={() => handleDeleteClick(client)}
                                                sx={{ 
                                                    textTransform: 'none',
                                                    color: 'error.main',
                                                    minWidth: 'auto',
                                                    p: 0.5,
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))}
                    </AnimatePresence>

                    {/* Mobile Pagination */}
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.8) : 'background.paper',
                        }}
                    >
                        <TablePagination
                            component="div"
                            count={filteredClients.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 15]}
                            sx={{
                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                    fontSize: '0.75rem',
                                },
                                '& .MuiTablePagination-select': {
                                    fontSize: '0.75rem',
                                },
                            }}
                        />
                    </Paper>
                </Box>
            ) : (
                /* Desktop Table View */
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.8) : 'background.paper',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: isDarkMode ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.light, 0.05),
                            }}>
                                <TableCell sx={{ fontWeight: 600 }}>Full Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Event Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Event Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClients
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((client) => (
                                    <TableRow
                                        key={client.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: theme.palette.primary.main,
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    {client.full_name?.charAt(0) || 'C'}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {client.full_name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{client.clientName || '-'}</TableCell>
                                        <TableCell>{client.event_type || '-'}</TableCell>
                                        <TableCell>{formatDate(client.eventDate)}</TableCell>
                                        <TableCell>{client.phone_number}</TableCell>
                                        <TableCell>{client.city || '-'}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditClient(client)}
                                                        sx={{
                                                            color: 'primary.main',
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                            },
                                                        }}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteClick(client)}
                                                        sx={{
                                                            color: 'error.main',
                                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.error.main, 0.2),
                                                            },
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={filteredClients.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                </TableContainer>
            )}

            {/* Mobile Floating Action Button */}
            {isMobile && (
                <Zoom in>
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={handleAddClient}
                        sx={{
                            position: 'fixed',
                            bottom: 80,
                            right: 16,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            width: 56,
                            height: 56,
                            boxShadow: 4,
                            zIndex: 1000,
                        }}
                    >
                        <Add />
                    </Fab>
                </Zoom>
            )}

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <Paper
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: 0,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        zIndex: 1000,
                    }}
                    elevation={3}
                >
                    <BottomNavigation showLabels>
                        <BottomNavigationAction
                            label="Clients"
                            icon={<Group />}
                            sx={{
                                color: theme.palette.primary.main,
                                '& .Mui-selected': {
                                    color: theme.palette.primary.main,
                                },
                            }}
                        />
                        <BottomNavigationAction
                            label="Events"
                            icon={<CalendarToday />}
                            onClick={() => window.location.href = '/events'}
                        />
                        <BottomNavigationAction
                            label="Dashboard"
                            icon={<ViewModule />}
                            onClick={() => window.location.href = '/dashboard'}
                        />
                    </BottomNavigation>
                </Paper>
            )}

            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
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
                        <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', width: 32, height: 32 }}>
                            <Info fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Delete Client
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Are you sure you want to delete this client? This action cannot be undone.
                    </Typography>
                    {selectedClient && (
                        <Box sx={{
                            p: 1.5,
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.error.main, 0.2),
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'error.main',
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    {selectedClient.full_name?.charAt(0) || 'C'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {selectedClient.full_name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedClient.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                    <Button
                        fullWidth={isMobile}
                        variant="outlined"
                        onClick={() => setOpenDeleteDialog(false)}
                        sx={{
                            borderRadius: 1.5,
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
                        onClick={handleDeleteConfirm}
                        disabled={loading}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            py: 1,
                            height: 48,
                            bgcolor: 'error.main',
                            '&:hover': { bgcolor: 'error.dark' },
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Delete Client'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientsListView;