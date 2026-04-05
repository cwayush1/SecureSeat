const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbPool = require('../config/db');
require('dotenv').config();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, role = 'User' } = req.body;

    try {
        // 1. Check if user exists
        const userExists = await dbPool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) return res.status(400).json({ message: 'User already exists' });

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into DB
        const newUser = await dbPool.query(
            'INSERT INTO Users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            user: newUser.rows[0],
            token: generateToken(newUser.rows[0].id, newUser.rows[0].role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await dbPool.query('SELECT * FROM Users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                token: generateToken(user.id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser };