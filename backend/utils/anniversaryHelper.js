const normalize = (v) => v?.toLowerCase().trim();

const getCalculatedAnniversary = async (
  db,
  death_tithi,
  death_paksha,
  death_masa
) => {

  if (!death_tithi || !death_masa) {
    return {
      calculated_anniversary_date: null,
      calculated_for_year: null
    };
  }

  // STEP 1 — Exact match
  let [rows] = await db.query(
    `
    SELECT date, year
    FROM yearly_panchang
    WHERE
      LOWER(TRIM(tithi)) = ?
      AND LOWER(TRIM(paksha)) = ?
      AND LOWER(TRIM(masa)) = ?
    ORDER BY date
    LIMIT 1
    `,
    [
      normalize(death_tithi),
      normalize(death_paksha),
      normalize(death_masa)
    ]
  );

  if (rows.length) {
    return {
      calculated_anniversary_date: rows[0].date,
      calculated_for_year: rows[0].year
    };
  }

  // STEP 2 — fallback (skip paksha but keep masa)
  [rows] = await db.query(
    `
    SELECT date, year
    FROM yearly_panchang
    WHERE
      LOWER(TRIM(tithi)) = ?
      AND LOWER(TRIM(masa)) = ?
    ORDER BY date
    LIMIT 1
    `,
    [
      normalize(death_tithi),
      normalize(death_masa)
    ]
  );

  if (rows.length) {
    return {
      calculated_anniversary_date: rows[0].date,
      calculated_for_year: rows[0].year
    };
  }

  return {
    calculated_anniversary_date: null,
    calculated_for_year: null
  };
};

module.exports = { getCalculatedAnniversary };