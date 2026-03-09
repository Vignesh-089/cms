const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../config/auth');
const { validateLoginInput, validatePassword } = require('../utils/validation');

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Phone and password are required'
            });
        }

        const [rows] = await req.db.query(
            'SELECT id, name, phone, password FROM admin WHERE phone = ?',
            [phone]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const admin = rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin.id,
                phone: admin.phone,
                name: admin.name
            },
            jwtSecret,
            { expiresIn: jwtExpire }
        );

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                admin: {
                    id: admin.id,
                    name: admin.name,
                    phone: admin.phone
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const [rows] = await req.db.query(
            'SELECT id, name, phone, created_at FROM admin WHERE id = ?',
            [req.admin.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                errors: passwordValidation.errors
            });
        }

        // Get current admin with password
        const [rows] = await req.db.query(
            'SELECT id, password FROM admin WHERE id = ?',
            [req.admin.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const admin = rows[0];

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await req.db.query(
            'UPDATE admin SET password = ? WHERE id = ?',
            [hashedPassword, req.admin.id]
        );

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const verifyToken = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: {
                admin: req.admin
            }
        });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const logout = async (req, res) => {
    try {
        // Since JWT is stateless, we just return success
        // Client should remove the token
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getUserDetailsForSetting = async (req, res) => {
    try {
        // req.admin comes from JWT middleware
        const adminId = req.admin.id;

        const [rows] = await req.db.query(
            `SELECT id, name, phone
             FROM admin 
             WHERE id = ?`,
            [adminId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.log('Server Error', error);
        res.status(500).json({
            success: false,
            message: 'server error'
        });
    }
};

module.exports = {
    login,
    getProfile,
    changePassword,
    verifyToken,
    logout,
    getUserDetailsForSetting
};