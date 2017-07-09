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
