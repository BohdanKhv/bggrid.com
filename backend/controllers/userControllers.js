const User = require('../models/userModel');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const emailLoginLink = require('../components/EmailLoginLink');
const { validateEmail } = require('../utils/utils');

// Email transporter
const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});



// @desc    Send email login link
// @route   POST /api/auth/get-login-link
// @access  Public
const sendLoginEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || validateEmail(email) === false) {
            return res.status(400).json({
                msg: 'Invalid email'
            });
        }

        // check if user exists if not, then create a new user
        let user;

        const userExists = await User.findOne
        ({
            email: { $regex: new RegExp(email, 'i') }
        });

        if (!userExists) {
            user = await User.create({
                email: email,
                accountType: 'work',
            });
        } else {
            user = userExists;
        }

        // Send email
        const token = generateToken(user._id);

        const emailLink = `${process.env.CLIENT_URL}/login-link?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your myBrewCrew login link',
            html: emailLoginLink(emailLink),
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    msg: 'Server error'
                });
            } else {
                return res.status(200).json({
                    msg: 'Email sent'
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Server error'
        });
    }
}


// @desc    Login user with token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                msg: 'Invalid token'
            });
        }

        // check if user exists if not, then create a new user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await
        User.findOne({ _id: decoded.id })

        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }

        return res.status(200).json({
            data: user,
            token: generateToken(user._id),
        });
    } catch (err) {
        // if error is token expired 
        if (err instanceof jwt?.TokenExpiredError || err?.name === 'TokenExpiredError') {
            return res.status(401).json({
                msg: 'Token expired'
            });
        } else {
            console.log(err);
            return res.status(500).json({
                msg: 'Server error'
            });
        }
    }
}



// @desc    Update user profile
// @route   PUT /api/users
// @access  Private
const updateUser = async (req, res) => {
    try {
        // Check if user exists
        const user = await User
        .findOne({ _id: req.user._id })

        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }

        const updatedUser = await user.save();

        res.status(200).json({
            data: updatedUser,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Server error'
        });
    }
}



// Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
        ignoreExpiration: true,
    });
}



module.exports = {
    sendLoginEmail,
    login,
    updateUser,
    generateToken,
}