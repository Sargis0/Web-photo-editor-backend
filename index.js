require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');

const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
require('./utils/passport');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: 'https://web-photo-editor.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/api/photos', photoRoutes);

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} | origin: ${req.headers.origin}`);
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5000, () => console.log('✅ The server started running on port 5000.'));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });
