const { getPanchang } = require("../utils/panchangHelper");
const { getMasaFromMappedDate } = require("../utils/masaHelper");
const { getCalculatedAnniversary } = require("../utils/anniversaryHelper");

/**
 * Calculate death anniversary details from actual death date
 * POST /api/death-anniversary/calculate
 */
const calculateDeathAnniversary = async (req, res) => {
    try {
        const { deathDate, clientName, phoneNumber } = req.body;

        if (!deathDate) {
            return res.status(400).json({
                success: false,
                message: "Death date is required"
            });
        }

        // Step 1: Get Panchang details for the death date
        const dateStr = new Date(deathDate).toISOString().split("T")[0];
        const panchang = await getPanchang(dateStr);

        if (!panchang.name || !panchang.paksha) {
            return res.status(404).json({
                success: false,
                message: "Unable to fetch Panchang details for the given date"
            });
        }

        // Step 2: Get Masa from yearly_panchang
        const deathMasa = await getMasaFromMappedDate(req.db, deathDate);

        if (!deathMasa) {
            return res.status(404).json({
                success: false,
                message: "Unable to determine Masa for the given date"
            });
        }

        // Step 3: Calculate current year's anniversary
        const currentYear = new Date().getFullYear();
        const anniversary = await getCalculatedAnniversary(
            req.db,
            panchang.name,
            panchang.paksha,
            deathMasa
        );

        // Step 4: Also calculate for next year
        const nextYearAnniversary = await getCalculatedAnniversary(
            req.db,
            panchang.name,
            panchang.paksha,
            deathMasa,
            currentYear + 1
        );

        // Step 5: Format response
        const response = {
            success: true,
            data: {
                death_date: deathDate,
                panchang_details: {
                    tithi: panchang.name,
                    paksha: panchang.paksha,
                    masa: deathMasa
                },
                current_year_anniversary: anniversary.calculated_anniversary_date,
                current_year: anniversary.calculated_for_year || currentYear,
                next_year_anniversary: nextYearAnniversary.calculated_anniversary_date,
                next_year: nextYearAnniversary.calculated_for_year || currentYear + 1,
                client_name: clientName || null,
                phone_number: phoneNumber || null
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Calculate Death Anniversary Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while calculating death anniversary"
        });
    }
};

/**
 * Get historical death anniversary dates for previous years
 * POST /api/death-anniversary/history
 */
const getDeathAnniversaryHistory = async (req, res) => {
    try {
        const { deathDate, deathTithi, deathPaksha, deathMasa, years = 5 } = req.body;

        if (!deathDate && (!deathTithi || !deathMasa)) {
            return res.status(400).json({
                success: false,
                message: "Either death date or panchang details are required"
            });
        }

        let tithi = deathTithi;
        let paksha = deathPaksha;
        let masa = deathMasa;
        let deathYear = null;

        // If death date is provided, get panchang details
        if (deathDate && !tithi) {
            const dateStr = new Date(deathDate).toISOString().split("T")[0];
            const panchang = await getPanchang(dateStr);
            tithi = panchang.name;
            paksha = panchang.paksha;
            masa = await getMasaFromMappedDate(req.db, deathDate);
            deathYear = new Date(deathDate).getFullYear();
        }

        if (!tithi || !masa) {
            return res.status(400).json({
                success: false,
                message: "Unable to determine panchang details"
            });
        }

        const currentYear = new Date().getFullYear();
        const history = [];

        // Calculate for previous years (from death year to current year)
        const startYear = deathYear || currentYear - years;
        
        for (let year = startYear; year <= currentYear; year++) {
            const anniversary = await getCalculatedAnniversary(
                req.db,
                tithi,
                paksha,
                masa,
                year
            );

            if (anniversary.calculated_anniversary_date) {
                history.push({
                    year,
                    anniversary_date: anniversary.calculated_anniversary_date,
                    calculated_for_year: anniversary.calculated_for_year
                });
            }
        }

        res.status(200).json({
            success: true,
            data: {
                panchang_details: { tithi, paksha, masa },
                history: history.sort((a, b) => b.year - a.year)
            }
        });

    } catch (error) {
        console.error("Death Anniversary History Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching anniversary history"
        });
    }
};

/**
 * Save calculated death anniversary as a client/event
 * POST /api/death-anniversary/save
 */
const saveDeathAnniversaryAsEvent = async (req, res) => {
    try {
        const {
            full_name,
            clientName,
            phone_number,
            occupation,
            address,
            city,
            state,
            pincode,
            notes,
            deathDate,
            death_tithi,
            death_paksha,
            death_masa,
            calculated_anniversary_date
        } = req.body;

        if (!full_name || !phone_number || !deathDate) {
            return res.status(400).json({
                success: false,
                message: "Full name, phone number, and death date are required"
            });
        }

        // Insert into clients table
        const [result] = await req.db.query(
            `INSERT INTO clients (
                full_name,
                clientName,
                eventDate,
                event_type,
                phone_number,
                occupation,
                address,
                city,
                state,
                pincode,
                notes,
                death_tithi,
                death_paksha,
                death_masa,
                calculated_anniversary_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                full_name,
                clientName || full_name,
                deathDate,
                'Death Anniversary',
                phone_number,
                occupation || null,
                address || null,
                city || null,
                state || null,
                pincode || null,
                notes || null,
                death_tithi,
                death_paksha,
                death_masa,
                calculated_anniversary_date || null
            ]
        );

        // Fetch the created client
        const [rows] = await req.db.query(
            "SELECT * FROM clients WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Death anniversary saved successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Save Death Anniversary Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while saving death anniversary"
        });
    }
};

module.exports = {
    calculateDeathAnniversary,
    getDeathAnniversaryHistory,
    saveDeathAnniversaryAsEvent
};