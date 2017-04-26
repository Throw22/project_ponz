const express = require('express');
const router = express.Router();
const {
    loggedInOnly,
    loggedOutOnly
} = require('../services/session');
const User = require('../models/').User;

router.get('/', loggedInOnly, function(req, res, next) {
    res.render('home');
});

router.get('/login', loggedOutOnly, function(req, res) {
    res.render('login');
});

router.delete('/logout', loggedInOnly, function(req, res) {
    req.session.destroy();
    req.method = 'GET';
    res.redirect('/login');
});

router.post('/login', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        email
    }).then(user => {
        //check password with bcrypt?
        if (user.validatePassword(password)) {
            req.user = user;
            res.redirect('/');
        }
        else {
            res.redirect('login');
        }
    });
});

module.exports = router;