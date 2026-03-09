const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

// Verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, jwtSecret);

            // Add admin info to request
            req.admin = {
                id: decoded.id,
                phone: decoded.phone,
                name: decoded.name
            };

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, invalid token'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

// Optional: Check if admin exists in database (extra security)
const checkAdminExists = async (req, res, next) => {
    try {
        const [rows] = await req.db.query(
            'SELECT id FROM admin WHERE id = ? AND phone = ?',
            [req.admin.id, req.admin.phone]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found'
            });
        }

        next();
    } catch (error) {
        console.error('Check admin error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    protect,
    checkAdminExists
};