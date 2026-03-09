import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  alpha,
} from '@mui/material';
import {
  MoreVert,
  Church,
  Info,
  Close,
  Visibility,
} from '@mui/icons-material';

// Transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AnniversaryList = ({ anniversaries, maxItems, showAll, theme, onViewAll }) => {
  const displayAnniversaries = showAll ? anniversaries : anniversaries.slice(0, maxItems);
  
  return (
    <List sx={{ p: 0 }}>
      {displayAnniversaries.map((anniversary, index) => (
        <React.Fragment key={anniversary.id}>
          <ListItem
            sx={{
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1.5, sm: 2 },
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 1,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.02),
              },
            }}
          >
            <ListItemAvatar sx={{ minWidth: { xs: 36, sm: 56 } }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.error.main,
                  color: 'white',
                  width: { xs: 28, sm: 40 },
                  height: { xs: 28, sm: 40 },
                  fontSize: { xs: '0.8rem', sm: '1.1rem' },
                }}
              >
                D
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.95rem' },
                    lineHeight: 1.2,
                    mb: 0.25
                  }}
                >
                  {anniversary.name}
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 0.25 }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    mb: 0.25
                  }}>
                    <Chip
                      label={anniversary.relationship}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        color: theme.palette.error.main,
                        fontWeight: 500,
                        height: { xs: 18, sm: 24 },
                        '& .MuiChip-label': {
                          fontSize: { xs: '0.55rem', sm: '0.7rem' },
                          px: { xs: 0.75, sm: 1.5 }
                        }
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      lineHeight: 1.2,
                      mb: 0.25
                    }}
                  >
                    {anniversary.tithi}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {anniversary.date}
                  </Typography>
                </Box>
              }
              sx={{
                m: 0,
                flex: '1 1 auto',
              }}
            />

            <IconButton
              size="small"
              color="info"
              sx={{
                p: { xs: 0.5, sm: 1 },
                mt: { xs: 0, sm: 0 },
                ml: { xs: 0, sm: 'auto' },
                alignSelf: { xs: 'flex-start', sm: 'center' },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                },
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.info.main, 0.15)
                    : alpha(theme.palette.info.main, 0.08),
                },
              }}
            >
              <Info fontSize="small" />
            </IconButton>
          </ListItem>
          {index < displayAnniversaries.length - 1 && (
            <Divider
              variant="fullWidth"
              component="li"
              sx={{
                mx: { xs: 1.5, sm: 2 },
                width: 'auto'
              }}
            />
          )}
        </React.Fragment>
      ))}
      
      {/* Show "View All" button if there are more items and not showing all */}
      {!showAll && anniversaries.length > maxItems && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ p: { xs: 1, sm: 2 }, textAlign: 'center' }}>
            <Button
              variant="text"
              color="error"
              onClick={onViewAll}
              startIcon={<Visibility />}
              size="small"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                textTransform: 'none',
                color: theme.palette.error.main,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.error.main, 0.15)
                    : alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              View All ({anniversaries.length - maxItems} more)
            </Button>
          </Box>
        </>
      )}
    </List>
  );
};

const DeathAnniversariesCard = ({ anniversaries = [] }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const maxInitialItems = 5;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Church color="error" sx={{ fontSize: { xs: 20, sm: 24 } }} />
              <Typography variant="h6" sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}>
                Death Anniversaries
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              Panchang-based calculations
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={`${anniversaries.length} Anniversaries`}
                color="error"
                size="small"
                sx={{ 
                  fontWeight: 600,
                  height: { xs: 24, sm: 32 },
                  '& .MuiChip-label': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    px: { xs: 1, sm: 1.5 }
                  }
                }}
              />
              <IconButton 
                size="small" 
                onClick={handleOpenDialog}
                sx={{ 
                  display: { xs: 'inline-flex' },
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.05),
                  },
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{
            p: { xs: 1.5, sm: 2 },
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            }
          }}
        />
        <Divider />
        <CardContent sx={{ p: { xs: 0, sm: 1 }, flex: 1 }}>
          <AnniversaryList 
            anniversaries={anniversaries}
            maxItems={maxInitialItems}
            showAll={false}
            theme={theme}
            onViewAll={handleOpenDialog}
          />
        </CardContent>
      </Card>

      {/* Dialog/Modal for all anniversaries */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        fullWidth
        fullScreen={false}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none',
            borderRadius: { xs: 0, sm: 2 },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: 'calc(100% - 64px)' },
            height: { xs: '100%', sm: 'auto' },
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: { xs: 'flex-end', sm: 'center' },
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: { xs: 2, sm: 3 },
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.error.dark, 0.2)
            : alpha(theme.palette.error.light, 0.1),
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Church color="error" />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              All Death Anniversaries
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseDialog}
            size="small"
            sx={{
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.05),
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 0, sm: 2 } }}>
          <DialogContentText component="div">
            <Box sx={{ 
              maxHeight: { xs: 'calc(100vh - 120px)', sm: '500px' },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.05),
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.2)
                  : alpha(theme.palette.common.black, 0.2),
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.3)
                    : alpha(theme.palette.common.black, 0.3),
                },
              },
            }}>
              <AnniversaryList 
                anniversaries={anniversaries}
                maxItems={anniversaries.length}
                showAll={true}
                theme={theme}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          borderTop: `1px solid ${theme.palette.divider}`,
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            color="error"
            fullWidth={false}
            sx={{
              minWidth: { xs: '100%', sm: '120px' },
              textTransform: 'none',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeathAnniversariesCard;