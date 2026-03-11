const { getCalculatedAnniversary } = require("../utils/anniversaryHelper");

const getLastTenDaysClientDetails = async (req, res) => {
    try {
        const [rows] = await req.db.query(
            'SELECT full_name, eventDate, event_type FROM clients WHERE eventDate BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 10 DAY)'
        );
        res.status(200).json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.log("Server Error", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
};

const getLastTenDeathAnniversaryDetails = async (req, res) => {
    try {

        const [clients] = await req.db.query(
            `SELECT * FROM clients WHERE event_type = 'Death Anniversary'`
        );

        const today = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(today.getDate() + 10);

        const results = [];

        for (const client of clients) {

            const anniversary = await getCalculatedAnniversary(
                req.db,
                client.death_tithi,
                client.death_paksha,
                client.death_masa
            );

            if (!anniversary.calculated_anniversary_date) continue;

            const anniversaryDate = new Date(anniversary.calculated_anniversary_date);

            if (anniversaryDate >= today && anniversaryDate <= tenDaysLater) {
                results.push({
                    ...client,
                    calculated_anniversary_date: anniversary.calculated_anniversary_date
                });
            }
        }

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        console.log("Server Error", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const getDashboardStats = async (req, res) => {

    try {

        const [stats] = await req.db.query(`
        SELECT COUNT(*) AS total_clients,
            COUNT(event_type) AS total_events,
            SUM(CASE WHEN DATE(eventDate) = CURDATE() THEN 1 ELSE 0 END) AS todays_events
            FROM clients
        `);

        res.json({
            success: true,
            data: stats[0]
        });

    } catch (error) {

        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getEventDistribution = async (req, res) => {
    try {

        const [rows] = await req.db.query(`
      SELECT event_type, COUNT(*) AS count
      FROM clients
      GROUP BY event_type
    `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("Distribution error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getLastTenDaysClientDetails,
    getLastTenDeathAnniversaryDetails,
    getDashboardStats,
    getEventDistribution
}