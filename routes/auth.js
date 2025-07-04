const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'https://web-photo-editor.netlify.app/login-failed'
    }),
    (req, res) => {
        res.redirect('https://web-photo-editor.netlify.app/loggedin');
    }
);


router.get('/user', (req, res) => {
    if (req.isAuthenticated()) res.json(req.user);
    else res.status(401).json({ message: 'Not authenticated' });
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid', {
            path: '/',
            secure: true,
            sameSite: 'none'
        });
        res.sendStatus(200);
    });
});

module.exports = router;
