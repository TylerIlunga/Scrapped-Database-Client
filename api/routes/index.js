const Router = require('express').Router();
const {
  SearchController,
  SeederController,
  StaticController,
} = require('../controllers');

Router.get('/api/ping', (req, res) => res.send('pong'));

// SEARCH
Router.get('/api/search/init', SearchController.init);
Router.post('/api/search/list', SearchController.list);
Router.post('/api/search/fetch', SearchController.fetch);
Router.post('/api/search/update', SearchController.update);

// SEED
Router.get('/api/seeder/seed', SeederController.seed);

// STATIC
Router.get('/', StaticController.webpage);

module.exports = Router;
