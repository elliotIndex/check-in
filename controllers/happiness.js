const User = require('../models/User');

/**
 * GET /happiness
 * Happiness page.
 */
exports.index = (req, res) => {
  res.render('happiness', {
    title: 'Happiness'
  });
};

/**
 * POST /happiness
 * Create a new happiness entry
 */
exports.postHappiness = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.happiness = user.happiness || [];
    user.happiness.push({
      timestamp: Date.now(),
      value: req.body.value || null,
      comment: req.body.comment || ''
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', {
        msg: 'Happiness entry has been entered successfully.'
      });
      res.redirect('/happiness');
    });
  });
};

/**
 * POST /happinessTest
 * Create a new happiness entry from TWILIO!!
 */
exports.postHappinessTest = (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send('Thanks!');
};
