const Sequelize = require('sequelize');

module.exports = (sequelize, options) => {
  // NOTE: IF CHANGES ARE MADE TO DB IN PROD
  // REMEMBER TO UPDATE CONFIG FILE "tables[table_name].columns"
  let Form = sequelize.define(
    'forms',
    {
      name: Sequelize.STRING,
      description: Sequelize.STRING,
      success_message: Sequelize.STRING(255),

      created_at: Sequelize.BIGINT,
    },
    {
      ...options,
      hooks: {
        beforeCreate: course => {
          course.created_at = Date.now();
        },
      },
    },
  );

  Form.associate = models => {};
  return Form;
};
