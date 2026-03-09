import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import {
  People,
  Event,
  CalendarToday,
  Notifications,
} from '@mui/icons-material';

import StatsCard from '../components/dashboard/StatsCard';
import UpcomingEventsCard from '../components/dashboard/UpcomingEventsCard';
import DeathAnniversariesCard from '../components/dashboard/DeathAnniversariesCard';
import EventDistributionCard from '../components/dashboard/EventDistributionCard';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import { getLastTenDaysClientDetails, getLastTenDeathAnniversaryDetails, getDashboardStats, getEventDistribution } from '../services/dashboardService';
import { useState } from 'react';
import { useEffect } from 'react';

const Dashboard = () => {
  const theme = useTheme();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [deathAnniversaries, setDeathAnniversaries] = useState([]);
  const [stats, setStats] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    fetchUpcomingEvents();
    fetchDeathAnniversaries();
    fetchDashboardStats();
    fetchEventDistribution();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {

      const res = await getLastTenDaysClientDetails();

      const formattedEvents = res.data.data.map((item, index) => {

        const eventDate = new Date(item.eventDate);
        const today = new Date();

        const diffTime = eventDate - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          id: index + 1,
          client: item.full_name,
          type: item.event_type,
          date: eventDate.toISOString().split("T")[0],
          daysLeft: daysLeft,
          priority:
            daysLeft <= 3 ? "high" :
              daysLeft <= 7 ? "medium" :
                "low"
        };
      });

      setUpcomingEvents(formattedEvents);

    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchDeathAnniversaries = async () => {
    try {

      const res = await getLastTenDeathAnniversaryDetails();

      const formattedAnniversaries = res.data.data.map((item, index) => {

        const eventDate = new Date(item.eventDate);

        return {
          id: index + 1,
          name: item.full_name,
          tithi: `${item.death_paksha} Paksha ${item.death_tithi}`,
          date: eventDate.toISOString().split("T")[0],
          relationship: item.clientName
        };

      });

      setDeathAnniversaries(formattedAnniversaries);

    } catch (error) {
      console.error("Error fetching death anniversaries", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {

      const res = await getDashboardStats();
      const data = res.data.data;

      const formattedStats = [
        {
          title: 'Total Clients',
          value: data.total_clients,
          icon: <People />,
          color: theme.palette.primary.main,
          change: '+12%',
          trend: 'up'
        },
        {
          title: 'Total Events',
          value: data.total_events,
          icon: <Event />,
          color: theme.palette.secondary.main,
          change: '+8%',
          trend: 'up'
        },
        {
          title: "Today's Events",
          value: data.todays_events,
          icon: <CalendarToday />,
          color: theme.palette.success?.main || '#4caf50',
          change: '+5%',
          trend: 'up'
        },
        {
          title: 'Pending Alerts',
          value: 0,
          icon: <Notifications />,
          color: theme.palette.warning?.main || '#ff9800',
          change: '0%',
          trend: 'down'
        }
      ];

      setStats(formattedStats);

    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    }
  };

  const fetchEventDistribution = async () => {

    try {

      const res = await getEventDistribution();

      const colors = {
        Wedding: "#4caf50",
        "Death Anniversary": "#f44336",
        Birthday: "#2196f3",
        Housewarming: "#ff9800"
      };

      const formatted = res.data.data.map((item) => ({
        name: item.event_type,
        count: item.count,
        color: colors[item.event_type] || "#9c27b0"
      }));

      setEventTypes(formatted);

    } catch (error) {

      console.error("Error fetching distribution", error);

    }
  };

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <WelcomeHeader />

      {/* Stats Cards - Horizontal scroll on mobile */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: { sm: 'wrap' },
          gap: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 2, sm: 3, md: 4 },
          mx: { xs: -0.5, sm: 0 },
          '& > *': {
            flex: { sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' },
            minWidth: { xs: '100%', sm: '200px' },
          }
        }}
      >
        {stats.map((stat, index) => (
          <Box key={index} sx={{ px: { xs: 0.5, sm: 0 } }}>
            <StatsCard {...stat} />
          </Box>
        ))}
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <UpcomingEventsCard events={upcomingEvents} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DeathAnniversariesCard anniversaries={deathAnniversaries} />
        </Box>
      </Box>

      {/* Event Distribution */}
      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <EventDistributionCard eventTypes={eventTypes} />
      </Box>
    </Container>
  );
};

export default Dashboard;