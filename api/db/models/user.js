const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, options) => {
  let User = sequelize.define(
    'users',
    {
      name: Sequelize.STRING,
      display_name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      instagram: Sequelize.STRING,
      password: Sequelize.STRING,
      avatar: Sequelize.STRING,
      stripe_id: Sequelize.STRING,
      card_brand: Sequelize.STRING,
      card_last4: Sequelize.INTEGER,
      card_zip: Sequelize.STRING,
      reset_token: Sequelize.STRING,
      display_text: Sequelize.STRING(255),
      created_at: Sequelize.BIGINT,
    },
    {
      ...options,
      hooks: {
        beforeCreate: user => {
          if (user.password)
            user.password = bcrypt.hashSync(
              user.password,
              bcrypt.genSaltSync(8),
            );

          if (user.name)
            user.affiliate_code =
              user.name.split(' ')[0].toLowerCase() +
              Math.random()
                .toString(36)
                .substring(2, 10);

          user.created_at = Date.now();
        },
      },
    },
  );

  User.associate = models => {
    User.hasMany(models.Subscription, {
      as: 'subscriptions',
      foreignKey: 'user_id',
    });
    User.belongsToMany(models.Form, {
      as: 'forms',
      foreignKey: 'user_id',
      through: 'user_forms',
    });
  };

  return User;
};
