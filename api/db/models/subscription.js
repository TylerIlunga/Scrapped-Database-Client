const Sequelize = require('sequelize');

module.exports = (sequelize, options) => {
  let Subscription = sequelize.define(
    'subscriptions',
    {
      status: Sequelize.ENUM(
        'trialing',
        'active',
        'incomplete',
        'incomplete_expired',
        'past_due',
        'canceled',
        'unpaid',
      ),

      // active: Sequelize.BOOLEAN,
      stripe_id: Sequelize.STRING, // subscription id

      stripe_customer: Sequelize.STRING,
      last_payment_date: { type: Sequelize.BIGINT, defaultValue: Date.now() },
      next_payment_date: Sequelize.BIGINT,
      canceled_at: Sequelize.BIGINT,

      created_at: { type: Sequelize.BIGINT, defaultValue: Date.now() },
    },
    {
      ...options,
      hooks: {
        beforeCreate: subscription => {
          subscription.created_at = Date.now();
        },
      },
    },
  );

  Subscription.associate = models => {
    Subscription.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };

  return Subscription;
};
