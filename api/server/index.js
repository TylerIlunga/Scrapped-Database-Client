require('dotenv').config();
const app = require('../../app.js');
const config = require('../config');

app.listen(config.port, error => {
  if (error) {
    return console.error(`Server.listen error:`, error);
  }
  console.log(`Listening on port ${config.port}`);
});
