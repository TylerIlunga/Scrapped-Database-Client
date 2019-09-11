const path = require('path');

module.exports = {
  webpage(req, res) {
    return res.sendFile(
      path.join(__dirname + '../../../../', 'build', 'index.html'),
    );
  },
};
