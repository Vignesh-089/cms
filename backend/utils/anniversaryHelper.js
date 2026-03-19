const normalize = (v) => v?.toLowerCase().trim();

const getCalculatedAnniversary = async (
  db,
  death_tithi,
  death_paksha,
  death_masa,
  targetYear = null
) => {

  if (!death_tithi || !death_masa) {
    return {
      calculated_anniversary_date: null,
      calculated_for_year: null
    };
  }

  let query = `
    SELECT date, year
    FROM yearly_panchang
    WHERE
      LOWER(TRIM(tithi)) = ?
      AND LOWER(TRIM(paksha)) = ?
      AND LOWER(TRIM(masa)) = ?
  `;
  
  const params = [
    normalize(death_tithi),
    normalize(death_paksha),
    normalize(death_masa)
  ];

  // If target year is specified, filter by that year
  if (targetYear) {
    query += ` AND year = ?`;
    params.push(targetYear);
  }

  query += ` ORDER BY date LIMIT 1`;

  // STEP 1 — Exact match
  let [rows] = await db.query(query, params);

  if (rows.length) {
    return {
      calculated_anniversary_date: rows[0].date,
      calculated_for_year: rows[0].year
    };
  }

  // STEP 2 — fallback (skip paksha but keep masa)
  let fallbackQuery = `
    SELECT date, year
    FROM yearly_panchang
    WHERE
      LOWER(TRIM(tithi)) = ?
      AND LOWER(TRIM(masa)) = ?
  `;
  
  const fallbackParams = [
    normalize(death_tithi),
    normalize(death_masa)
  ];

  if (targetYear) {
    fallbackQuery += ` AND year = ?`;
    fallbackParams.push(targetYear);
  }

  fallbackQuery += ` ORDER BY date LIMIT 1`;

  [rows] = await db.query(fallbackQuery, fallbackParams);

  if (rows.length) {
    return {
      calculated_anniversary_date: rows[0].date,
      calculated_for_year: rows[0].year
    };
  }

  // STEP 3 — If no match for target year, get from any year
  if (targetYear) {
    return getCalculatedAnniversary(db, death_tithi, death_paksha, death_masa, null);
  }

  return {
    calculated_anniversary_date: null,
    calculated_for_year: null
  };
};

module.exports = { getCalculatedAnniversary };