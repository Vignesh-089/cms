const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const setupAdmin = async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database (setupAdmin)');

        const [rows] = await connection.execute(
            'SELECT id FROM admin WHERE phone = ?',
            [process.env.ADMIN_PHONE]
        );

        if (rows.length > 0) {
            console.log('Admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        await connection.execute(
            'INSERT INTO admin (name, phone, password) VALUES (?, ?, ?)',
            [process.env.ADMIN_NAME, process.env.ADMIN_PHONE, hashedPassword]
        );

        console.log('Admin created successfully');
        console.log('Phone:', process.env.ADMIN_PHONE);

    } catch (error) {
        console.error('Setup admin error:', error);
    } finally {
        if (connection) await connection.end();
    }
};

setupAdmin();