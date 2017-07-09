const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/twilio
 * Twilio API example.
 */
exports.getTwilio = (req, res) => {
  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

/**
 * POST /api/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = (req, res, next) => {
  req.assert('number', 'Phone number is required.')
    .notEmpty();
  req.assert('message', 'Message cannot be blank.')
    .notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twilio');
  }

  const message = {
    to: req.body.number,
    from: process.env.TWILIO_NUMBER,
    body: req.body.message,
  };

  twilio.messages
    .create(message)
    .then((message) => {
      req.flash('success', { msg: `Text sent to ${message.to}.` });
      res.redirect('/api/twilio');
    })
    .catch(err => next(err.message));
};
