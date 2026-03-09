const XLSX = require("xlsx");

/*
    Get All Events with Calculated Anniversary
*/
const getAllEvents = async (req, res) => {

    try {

        const currentYear = new Date().getFullYear();

        // Get all clients
        const [clients] = await req.db.query(
            "SELECT * FROM clients"
        );

        // Get panchang for current and next year
        const [calendar] = await req.db.query(
            `
            SELECT *
            FROM yearly_panchang
            WHERE year IN (?, ?)
            ORDER BY date
            `,
            [currentYear, currentYear + 1]
        );

        const results = clients.map(client => {

            if (client.event_type !== "Death Anniversary") {
                return client;
            }

            if (!client.death_tithi || !client.death_paksha || !client.death_masa) {
                return {
                    ...client,
                    calculated_anniversary_date: null,
                    calculated_for_year: currentYear,
                    message: "Missing tithi / paksha / masa"
                };
            }

            const match = calendar.find(c =>

                c.tithi?.toLowerCase().trim() ===
                client.death_tithi?.toLowerCase().trim()

                &&

                c.paksha?.toLowerCase().trim() ===
                client.death_paksha?.toLowerCase().trim()

                &&

                c.masa?.toLowerCase().trim() ===
                client.death_masa?.toLowerCase().trim()

                &&

                new Date(c.date) >= new Date(`${currentYear}-01-01`)
            );

            const finalMatch = match || calendar.find(c =>

                c.tithi?.toLowerCase().trim() ===
                client.death_tithi?.toLowerCase().trim()

                &&

                c.paksha?.toLowerCase().trim() ===
                client.death_paksha?.toLowerCase().trim()

                &&

                c.masa?.toLowerCase().trim() ===
                client.death_masa?.toLowerCase().trim()

                &&

                new Date(c.date) >= new Date(`${currentYear + 1}-01-01`)
            );

            return {
                ...client,
                calculated_anniversary_date: finalMatch?.date || null,
                calculated_for_year: finalMatch
                    ? new Date(finalMatch.date).getFullYear()
                    : currentYear,
                anniversary_found: !!finalMatch
            };

        });

        res.json({
            success: true,
            data: results,
            summary: {
                total_clients: results.length,
                death_anniversary_count: results.filter(
                    c => c.event_type === "Death Anniversary"
                ).length,
                found_anniversaries: results.filter(
                    c => c.anniversary_found
                ).length
            }
        });

    } catch (err) {

        console.error("Error in getAllEvents:", err);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });

    }

};


/*
    Upload yearly panchang Excel
*/
const uploadYearlyPanchang = async (req, res) => {

    try {

        const year = parseInt(req.params.year);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Excel file is required"
            });
        }

        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer"
        });

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        const data =
            XLSX.utils.sheet_to_json(sheet);

        if (!data.length) {
            return res.status(400).json({
                success: false,
                message: "Excel file is empty"
            });
        }

        // Delete old records
        await req.db.query(
            "DELETE FROM yearly_panchang WHERE year = ?",
            [year]
        );

        let insertedCount = 0;

        for (const row of data) {

            let date = row.Date;

            const tithi = row.Tithi;
            const paksha = row.Paksha;

            // Excel column may be Masa or masa
            const masa = row.masa || row.Masa || null;

            // Fix excel numeric date
            if (typeof date === "number") {
                date = XLSX.SSF.format("yyyy-mm-dd", date);
            }

            if (!date || !tithi || !paksha) {
                continue;
            }

            await req.db.query(
                `
                INSERT INTO yearly_panchang
                (year, date, tithi, paksha, masa)
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    year,
                    date,
                    tithi,
                    paksha,
                    masa
                ]
            );

            insertedCount++;

        }

        res.json({
            success: true,
            message: "Panchang uploaded successfully",
            inserted_rows: insertedCount
        });

    } catch (error) {

        console.error("Upload Panchang Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


module.exports = {
    getAllEvents,
    uploadYearlyPanchang
};