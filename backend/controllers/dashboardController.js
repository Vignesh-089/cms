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
        const [rows] = await req.db.query(
            `SELECT full_name, clientName, death_tithi, death_paksha, eventDate, event_type FROM clients WHERE eventDate BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 10 DAY) AND event_type = 'Death Anniversary'`
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