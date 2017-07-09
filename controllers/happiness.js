const User = require('../models/User');
const StringUtils = require('../utils/string-utils');
const ciTwilio = require('./check-in-twilio.js');

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
exports.postHappinessTest = (req, res) => {
  const messageInfo = req.body;
  const fromPhone = messageInfo.From;
  const value = StringUtils.getFirstNumber(messageInfo.Body);
  const comment = messageInfo.Body;

  User.findOne({ 'profile.phone': fromPhone }, (err, user) => {
    if (err) {
      ciTwilio.sendMessage(fromPhone,
        'Uh oh! It looks like you haven\'t set up a Check In account. Head over to ' +
        'check-in.herokuapp.com to set one up now!');
    } else if (!(value >= 1 && value <= 10)) {
      ciTwilio.sendMessage(fromPhone,
        'Sorry, but I couldn\'t figure out a happiness value from your last text. Can you send ' +
        'another message with a rating from 1 to 10? Thanks!');
    } else {
      user.happiness = user.happiness || [];
      user.happiness.push({ timestamp: Date.now(), value, comment });
      user.save((err) => {
        if (err) {
          ciTwilio.sendMessage(fromPhone,
            'Oh no! I wasn\'t able to save your most recent happiness update. Can you try again ' +
            'with a different messgage?');
        } else {
          ciTwilio.sendMessage(fromPhone, 'Got it! Thanks for the update.');
        }
      });
    }
    res.set('Content-Type', 'text/xml');
    res.send('Thanks Twilio!');
  });
};
