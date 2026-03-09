import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  WbSunny,
  NightsStay,
  Agriculture,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { getPanchangByDate } from "../../services/panchangService";

const PanchangDetails = ({ selectedDate, events, isMobile }) => {
  const theme = useTheme();

  const [panchang, setPanchang] = useState(null);

  useEffect(() => {
    fetchPanchang();
  }, [selectedDate]);

  const fetchPanchang = async () => {
    try {
      const date = format(selectedDate, "yyyy-MM-dd");
      const res = await getPanchangByDate(date);
      setPanchang(res.data.data);
    } catch (error) {
      console.error("Error fetching Panchang", error);
    }
  };

  const deathAnniversaries = events.filter(e => e.type === 'death_anniversary');

  // Mobile-optimized view
  if (isMobile) {
    return (
      <Box>
        {/* Header with date */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
        }}>
          <WbSunny sx={{ fontSize: 18, color: theme.palette.warning.main }} />
          <Typography sx={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}>
            {format(selectedDate, 'MMM d, yyyy')}
          </Typography>
        </Box>

        {/* Main Panchang Info - Compact Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1,
          mb: 1.5,
        }}>
          {/* Tithi */}
          <Paper sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Typography sx={{
              fontSize: '0.6rem',
              color: theme.palette.text.secondary,
              mb: 0.25,
            }}>
              Tithi
            </Typography>
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              {panchang?.tithi}
            </Typography>
          </Paper>

          {/* Paksha */}
          <Paper sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Typography sx={{
              fontSize: '0.6rem',
              color: theme.palette.text.secondary,
              mb: 0.25,
            }}>
              Paksha
            </Typography>
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              {panchang?.paksha}
            </Typography>
          </Paper>

          {/* Maas */}
          <Paper sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Typography sx={{
              fontSize: '0.6rem',
              color: theme.palette.text.secondary,
              mb: 0.25,
            }}>
              Maas
            </Typography>
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              {panchang?.masa}
            </Typography>
          </Paper>
        </Box>

        {/* Death Anniversaries - Compact */}
        {deathAnniversaries.length > 0 && (
          <Box>
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: theme.palette.error.main,
              mb: 1,
            }}>
              🕯️ Death Anniversaries ({deathAnniversaries.length})
            </Typography>

            {deathAnniversaries.map((event) => (
              <Paper
                key={event.id}
                sx={{
                  p: 1,
                  mb: 1,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.error.main, 0.03),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                <Typography sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: theme.palette.error.main,
                }}>
                  {event.title}
                </Typography>
                <Typography sx={{
                  fontSize: '0.65rem',
                  color: theme.palette.text.secondary,
                  mb: 0.5,
                }}>
                  {event.client}
                </Typography>
                {event.panchang && (
                  <Box sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexWrap: 'wrap',
                  }}>
                    <Chip
                      size="small"
                      label={event.panchang.tithi}
                      sx={{
                        height: 18,
                        fontSize: '0.55rem',
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                      }}
                    />
                    <Chip
                      size="small"
                      label={event.panchang.maas}
                      sx={{
                        height: 18,
                        fontSize: '0.55rem',
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                      }}
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // Desktop version (original but optimized)
  return (
    <Box>
      <Typography sx={{
        fontSize: '1rem',
        fontWeight: 600,
        color: theme.palette.text.primary,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <WbSunny sx={{ fontSize: 20, color: theme.palette.warning.main }} />
        Panchang Details for {format(selectedDate, 'MMMM d, yyyy')}
      </Typography>

      <Grid container spacing={2}>
        {/* Main Panchang Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            height: '100%',
          }} elevation={0}>
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 1.5,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <Agriculture sx={{ fontSize: 18 }} />
              Tithi & Nakshatra
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
            }}>
              {[
                { label: 'Tithi', value: panchang?.tithi },
                { label: 'Paksha', value: panchang?.paksha },
                { label: 'Maas', value: panchang?.masa },
              ].map((item, index) => (
                <Box key={index}>
                  <Typography sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PanchangDetails;