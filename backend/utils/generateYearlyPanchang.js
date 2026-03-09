const { getPanchang } = require('./panchangHelper');

const generateYearlyPanchang = async (db, year) => {

    const start = new Date(`${year}-01-01`);

    for (let i = 0; i < 366; i++) {

        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const dateStr = d.toISOString().split("T")[0];

        const p = await getPanchang(dateStr);

        await db.query(
            `INSERT INTO yearly_panchang
            (year, date, tithi, paksha, masa)
            VALUES (?, ?, ?, ?, ?)`,
            [
                year,
                dateStr,
                p.name,
                p.paksha,
                p.masa
            ]
        );

        await new Promise(r => setTimeout(r, 13000));
    }
};

module.exports = { generateYearlyPanchang };