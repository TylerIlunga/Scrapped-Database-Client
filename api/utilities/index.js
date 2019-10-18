const capitalize = text => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

module.exports = {
  capitalize,
  snakeToCamel(text) {
    return text
      .split('_')
      .map(w => capitalize(w))
      .join('');
  },
};
