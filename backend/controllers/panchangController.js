const getPanchangByDate = async (req, res) => {
  try {

    const { date } = req.query;

    const [rows] = await req.db.query(
      `SELECT 
        tithi,
        paksha,
        masa
       FROM yearly_panchang
       WHERE date = ?`,
      [date]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Panchang not found"
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {

    console.error("Panchang error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { getPanchangByDate };