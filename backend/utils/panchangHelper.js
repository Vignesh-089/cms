const axios = require("axios");

const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

const COORDINATES = "10.962924,79.649414";
const TIMEZONE = "Asia/Kolkata";

const getAccessToken = async () => {

  const response = await axios.post(
    "https://api.prokerala.com/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return response.data.access_token;
};

const getPanchang = async (dateStr) => {

  const token = await getAccessToken();

  const response = await axios.get(
    "https://api.prokerala.com/v2/astrology/panchang",
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        datetime: `${dateStr}T06:00:00+05:30`,
        coordinates: COORDINATES,
        timezone: TIMEZONE,
        ayanamsa: 1
      }
    }
  );

  const data = response.data.data;
  const tithi = data.tithi?.[0];

  return {
    name: tithi?.name || null,
    paksha: tithi?.paksha || null
  };
};

module.exports = { getPanchang };