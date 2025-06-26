require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
require('./utils/passport');

const app = express();

app.use(cors({ origin: 'https://web-photo-editor.netlify.app', credentials: true }));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/api/photos', photoRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(5000, () => console.log('Server started on port 5000')))
    .catch(err => console.error('MongoDB connection error:', err));