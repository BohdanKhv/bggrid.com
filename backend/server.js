const express = require('express');
const { DateTime } = require("luxon");
const path = require('path');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');


// connect to database
connectDB();


// Initialize express
const app = express();

// Cors
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://192.168.1.101:5173', 'http://bggrid.com'],
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


// Body parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));

// Router
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/publishers', require('./routes/publisherRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/plays', require('./routes/playRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));


// Server frontend
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html')))
} else {
    app.get('/', (req, res) => res.send('Please set to production'))
}

// run on http://192.168.1.101:5000

// Server
// app.listen(port, '192.168.1.101', () => {
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});