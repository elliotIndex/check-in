exports.getFirstNumber = (str) => {
  try {
    const numAsStr = str.match(/\d+/)[0];
    if (!numAsStr) {
      return null;
    }
    const numAsNum = +numAsStr;
    if (isNaN(numAsNum)) {
      return null;
    }
    return numAsNum;
  } catch (error) {
    return null;
  }
};

exports.formatTwilioPhone = (phoneNum) => {
  let digits = phoneNum.match(/\d/g).join('');
  if (digits.length < 11) {
    digits = `1${digits}`;
  }
  return `+${digits}`;
};
