const Sequelize = require('sequelize');
const { db } = require('../config');

let connection = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

const options = {
  freezeTableName: true,
  timestamps: false,
};

const models = {
  Form: require('./models/form')(connection, options),
  Lead: require('./models/lead')(connection, options),
  User: require('./models/user')(connection, options),
  Subscription: require('./models/subscription')(connection, options),
};

if (!process.env.PROD) console.log('Listing Models:');
Object.keys(models).forEach(key => {
  if (!process.env.PROD) console.log(key);
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

connection.sync().then(() => console.log('synced tables.'));

module.exports = {
  ...models,
  connection,
  Sequelize,
};
