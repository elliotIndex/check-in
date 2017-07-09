exports.getFirstNumber = (str) => {
  const numAsStr = str.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2');
  if (!numAsStr) {
    return null;
  }
  return +numAsStr;
};
