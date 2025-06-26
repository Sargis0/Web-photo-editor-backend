const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: 'https://web-photo-editor.netlify.app',
        failureRedirect: 'https://web-photo-editor.netlify.app'
    })
);

router.get('/user', (req, res) => {
    if (req.isAuthenticated()) res.json(req.user);
    else res.status(401).json({ message: 'Not authenticated' });
});

module.exports = router;
