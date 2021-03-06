const express = require('express');
const router = express.Router();
const User = require('../models/').User;

module.exports = function(passport) {
  router.post(
    '/local',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );

  return router;
};
