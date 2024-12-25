const User = require('../models/userModel');
const Library = require('../models/libraryModel');
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
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const pJson = require('../../package.json');

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



// @desc    Continue with google
// @route   POST /api/auth/google
// @access  Public
const continueWithGoogle = async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({
                msg: 'Invalid token'
            });
        }

        // Use the tokens to get user info or authenticate the user in your system
        const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        const userInfo = userInfoResponse.data;

        const { email, name, picture, given_name, family_name } = userInfo;

        // Check if user exists
        const user = await User.findOne({
            email: { $regex: new RegExp(email, 'i') }
        });

        if (user) {
            if (!user.avatar) {
                user.avatar = picture;
            }
            // If user was registered with email and password, but logs in with google for the first time
            // Set email as verified, as google verifies emails
            // Delete password, as user won't have a password if they log in with google
            if (!user.isGoogleOauth) {
                user.isGoogleOauth = true; // Set email as verified if user logs in with google
                // Delete password if user logs in with google, as they won't have a password
                user.password = undefined;
                await user.save();
            }
            user.lastLogin = new Date();
            await user.save();

            return res.status(200).json({
                data: {
                    ...user._doc,
                    token: generateToken(user._id)
                }
            });
        }

        // Create user
        const newUser = await User.create({
            email,
            username: name ? `${name.replaceAll(' ', '')}${Math.floor(Math.random() * 1000)}` : `${email.split('@')[0]}${Math.floor(Math.random() * 1000)}`,
            firstName: given_name,
            lastName: family_name,
            avatar: picture,
            isGoogleOauth: true,
        });

        await newUser.save();

        return res.status(201).json({
            data: {
                ...newUser._doc,
                token: generateToken(newUser._id)
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
}



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
            isGoogleOauth: false,
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
        // get my library
        // get my follow
        const games = await Library.find({ user: req.user._id })
        .populate('game', 'name thumbnail')

        return res.status(200).json({
            data: {
                user: {
                    ...req.user,
                    token: generateToken(req.user._id)
                },
                library: games,
                serverVersion: pJson.version
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

        if (user && user.isGoogleOauth && !user.password) {
            return res.status(400).json({
                msg: 'Please login with Google'
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
        const { firstName, lastName, username, bggUsername, followingUsersLibraryUpdates, taggedInPlays, newFollowers, bio } = req.body;

        // Check if user exists
        const user = await User
        .findById(req.user._id)
        .select('-password');

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
                    msg: 'Username already in use'
                });
            } else {
                user.username = username.trim()
            }
        }

        if (followingUsersLibraryUpdates !== undefined) user.notifications.followingUsersLibraryUpdates = followingUsersLibraryUpdates;
        if (taggedInPlays !== undefined) user.notifications.taggedInPlays = taggedInPlays;
        if (newFollowers !== undefined) user.notifications.newFollowers = newFollowers;
        if (bio !== undefined) user.bio = bio;

        if (bggUsername !== undefined) {
            // check if username is available
            const uCheck = await User.findOne({
                'bggUsername': {'$regex': `^${bggUsername}$`, '$options': 'i'}
            });

            if (uCheck) {
                return res.status(400).json({
                    msg: 'This board game geek username already in use'
                });
            } else {
                user.bggUsername = bggUsername.trim()
            }
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;

        if (req.file) {
            const fileExtension = req.file.originalname.split('.').pop() || '';
            const newKey = `users/${user._id}-${new Date().getTime()}.${fileExtension}`;
            const {error, key} = await uploadFile({  bucket: 'bggrid', key: newKey, file: req.file });
            if(error) {
                return res.status(500).json({
                    msg: 'Error uploading image',
                });
            }

            // Delete old avatar
            if (user.avatar) {
                await deleteFile({ bucket: 'bggrid', key: user.avatar });
            }

            user.avatar = key;
        }

        const updatedUser = await user.save();

        return res.status(200).json({
                data: {
                    ...updatedUser._doc,
                    token: generateToken(updatedUser._id)
                },
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
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
            from: 'no-reply@bggrid.com',
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
                    password: hashedPassword,
                    isGoogleOauth: false, // If user resets password, they can't login with google anymore
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
    continueWithGoogle,
    getMe,
    register,
    login,
    updateUser,
    generateToken,
    forgotPassword,
    resetPassword
}