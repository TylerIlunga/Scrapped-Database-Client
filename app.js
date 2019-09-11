const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');
const path = require('path');
const routes = require('./api/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cors());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/', routes);

module.exports = app;
