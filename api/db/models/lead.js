const Sequelize = require('sequelize');

module.exports = (sequelize, options) => {
  // NOTE: IF CHANGES ARE MADE TO DB IN PROD
  // REMEMBER TO UPDATE CONFIG FILE "tables[table_name].columns"
  let Lead = sequelize.define(
    'leads',
    {
      email: Sequelize.STRING,
      name: Sequelize.STRING,
      instagram: Sequelize.STRING,

      funnel_id: Sequelize.INTEGER,

      advisor_id: Sequelize.INTEGER,
      affiliate_id: Sequelize.INTEGER,

      active: {
        type: Sequelize.BOOLEAN,
        default: true,
      },

      created_at: Sequelize.BIGINT,
    },
    {
      ...options,
      hooks: {
        beforeCreate: lead => {
          lead.active = true;

          if (!lead.created_at) lead.created_at = Date.now();
        },
      },
    },
  );

  Lead.associate = models => {
    Lead.belongsTo(models.User, {
      as: 'affiliate',
      foreignKey: 'affiliate_id',
    });
    Lead.belongsTo(models.User, { as: 'advisor', foreignKey: 'advisor_id' });
  };

  return Lead;
};
