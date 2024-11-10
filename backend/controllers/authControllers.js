const User = require('../models/userModel');
const ResetToken = require('../models/resetTokenModel');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailLoginLink = require('../components/EmailLoginLink');
const emailResetLink = require('../components/EmailResetLink');
const { validateEmail } = require('../utils/utils');
const { uploadFile, deleteFile } = require('../utils/s3');
const { checkPasswordStrength } = require('../utils/utils');
const { DateTime } = require('luxon');

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



// @desc    Register user and create company
// @route   POST /api/users
// @access  Public
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!email || password === '' || !username || username.trim() === '' || password === '' || password.length < 6) {
            return res.status(400).json({
                msg: 'Please enter all fields'
            });
        }

        // Check if invite exists
        const uCheck = await User.findOne({
            'username': {'$regex': `^${username}$`, '$options': 'i'}
        });
        
        if (uCheck) {
            return res.status(400).json({
                msg: 'This username is already in use'
            });
        }

        const eCheck = await User.findOne({
            'email': {'$regex': `^${email}$`, '$options': 'i'}
        });

        if (eCheck) {
            return res.status(400).json({
                msg: 'This email is already in use'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({
            data: {
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                token: generateToken(newUser._id)
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
};


// @desc    Get me
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            data: {
                ...req.user,
                token: generateToken(req.user._id)
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Server error'
        });
    }
}


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

        const emailLink = `${process.env.CLIENT_URL}/login-with-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your log in link',
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                msg: 'Please enter all fields'
            });
        }

        const user = await User.findOne({
            email: { $regex: new RegExp(email, 'i') }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }

        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            data: {
                ...user._doc,
                token: generateToken(user._id)
            },
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
        const { firstName, lastName, username } = req.body;

        // Check if user exists
        const user = await User
        .findOne({ _id: req.user._id })

        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }

        if (username !== undefined) {
            // check if username is available
            const uCheck = await User.findOne({
                'username': {'$regex': `^${username}$`, '$options': 'i'}
            });

            if (uCheck) {
                return res.status(400).json({
                    msg: 'This username is already in use'
                });
            } else P
            user.username = username.trim()
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;


        if (req.file) {
            const fileExtension = req.file.originalname.split('.').pop() || '';
            const newKey = `${user._id}-${new Date().getTime()}.${fileExtension}`;
            const {error, key} = await uploadFile({  bucket: 'users', key: newKey, file: req.file });
            if(error) {
                return res.status(500).json({
                    msg: 'Error uploading image',
                });
            }

            user.avatar = key;
        }

        const updatedUser = await user.save();

            res.status(200).json({
                data: {
                    ...updatedUser._doc,
                    token: generateToken(updatedUser._id)
                },
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Server error'
        });
    }
}



// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email exists
        const user = await User.findOne({
            $or: [
                { 'email': {'$regex': `^${email}$`, '$options': 'i'} },
            ]
        })

        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }

        // Check if user has a reset token
        await ResetToken.deleteMany({ user: user._id });

        const token = crypto.randomBytes(32).toString('hex');

        // Create reset token
        const newToken = await ResetToken.create({
            user: user._id,
            token: token
        });

        if (!newToken) {
            return res.status(400).json({
                msg: "Couldn't create reset token"
            });
        }

        const mailOptions = {
            from: 'noreply@emplorex.com',
            to: user.email,
            subject: 'Reset Password',
            priority: 'high',
            html: emailResetLink(token, newToken.user),
        };

        transporter.sendMail(mailOptions, async (err, info) => {
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


// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { password, token, id } = req.body;

        // Check if password is not empty
        if (!password || password === '' || password === undefined || password?.length < 6) {
            return res.status(400).json({
                msg: 'Please enter a password'
            });
        }
        // Check if token exists
        const resetToken = await ResetToken.findOne({user: id});

        if (!resetToken) {
            return res.status(400).json({
                msg: 'Token does not exist'
            });
        }

        // Check if token matches hashed token
        const isMatch = await bcrypt.compare(token, resetToken.token);

        if (!isMatch) {
            return res.status(400).json({
                msg: 'Invalid token'
            });
        }

        // Check if token has expired, 1 hour
        if (DateTime.fromJSDate(resetToken.createdAt) < DateTime.now().minus({ hours: 1 })) {
            await resetToken.remove();

            return res.status(400).json({
                msg: 'Reset request has expired'
            });
        }

        // Check password strength (must have strength of 2 or higher)
        if (password.length < 6) {
            return res.status(400).json({
                msg: 'Password is too weak, must be at least 6 characters long'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { _id: resetToken.user },
            {
                $set: {
                    password: hashedPassword
                }
            },
        );

        // Remove reset token
        await resetToken.deleteOne();

        if (updatedUser) {
            res.status(200).json({
                msg: 'Password updated'
            });
        } else {
            return res.status(400).json({
                msg: 'Invalid user data'
            });
        }
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
    });
}



module.exports = {
    getMe,
    register,
    sendLoginEmail,
    login,
    updateUser,
    generateToken,
    forgotPassword,
    resetPassword
}