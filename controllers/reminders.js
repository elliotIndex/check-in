const cron = require('node-cron');
const User = require('../models/User');
const ciTwilio = require('./check-in-twilio');

const remindersScheduleMap = {}; // user_id: schedule

const stopReminder = (user) => {
  if (remindersScheduleMap[user._id]) {
    remindersScheduleMap[user._id].stop();
  }
};

const createReminder = (user) => {
  stopReminder(user);
  const [hour, minute] = user.reminders.time.split(':');

  remindersScheduleMap[user._id] = cron.schedule(`0 ${minute} ${hour} * * * *`, () => {
    console.log('Send a reminder to', user.profile.name);
    ciTwilio.sendMessage(user.profile.phone, 'How are you doing right now?');
  });
};

exports.scheduleAllReminders = () => {
  User.find({ 'reminders.should': true }, (err, users) => {
    users.forEach(user => createReminder(user));
  });
};

exports.stopReminder = stopReminder;
exports.createReminder = createReminder;
