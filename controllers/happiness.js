const User = require('../models/User');
const StringUtils = require('../utils/string-utils');

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
 * GET /happinessData
 * Happiness data.
 */
exports.happinessData = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    res.set('Content-Type', 'application/json');
    res.send(user.happiness);
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
exports.postHappinessTest = (req, res, next) => {
  const messageInfo = req.body;
  const sender = messageInfo.From;
  const value = StringUtils.getFirstNumber(messageInfo.Body);
  const comment = messageInfo.Body;

  User.findOne({
    'profile.phone': sender
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    user.happiness = user.happiness || [];
    user.happiness.push({ timestamp: Date.now(), value, comment });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.set('Content-Type', 'text/xml');
      res.send('Thanks!');
    });
  });
};
