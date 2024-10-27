const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    // Check if authorization header is set
    if (req?.headers?.authorization && req?.headers?.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            msg: 'No token provided'
        });
    }

    try {
        // Verify token
        // Ignore expiration
        // const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

        // Set user to req.user
        const user = await User.findById(decoded.id)

        if(!user) {
            return res.status(401).json({
                msg: 'User not found'
            });
        }

        req.user = user._doc;

        next();
    } catch (error) {
        // if error is token expired 
        if (error instanceof jwt?.TokenExpiredError || error?.name === 'TokenExpiredError') {
            return res.status(401).json({
                msg: 'Token expired'
            });
        } else {
            console.log('Not authorized error', error)
            return res.status(401).json({
                msg: 'Token failed'
            });
        }
    }
};



module.exports = {
    protect,
};