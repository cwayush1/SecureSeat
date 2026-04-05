const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            // Extract token from "Bearer <token>"
            token = token.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user info to the request object for the next controller to use
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };