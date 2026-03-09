const getMasaFromMappedDate = async (db, eventDate) => {

    const date = new Date(eventDate);

    const mappedDate =
        `2026-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

    const [rows] = await db.query(
        `
        SELECT masa
        FROM yearly_panchang
        WHERE date = ?
        `,
        [mappedDate]
    );

    if (rows.length) {
        return rows[0].masa;
    }

    return null;
};

module.exports = { getMasaFromMappedDate };