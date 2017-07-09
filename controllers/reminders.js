const cron = require('node-cron');
const User = require('../models/User');
const ciTwilio = require('./check-in-twilio');

const remindersScheduleMap = {}; // user_id: schedule

const createReminder = (user) => {
  const [hour, minute] = user.reminders.time.split(':');

  remindersScheduleMap[user._id] = cron.schedule(`0 ${minute} ${hour} * * * *`, () => {
    console.log('Send a reminder to', user.profile.name);
    ciTwilio.sendMessage(user.profile.phone, 'How are you doing right now?');
  });
};

exports.stopReminder = (userId) => {
  remindersScheduleMap[userId].stop();
};

exports.scheduleAllReminders = () => {
  User.find({ 'reminders.should': true }, (err, users) => {
    users.forEach(user => createReminder(user));
  });
};

exports.createReminder = createReminder;
