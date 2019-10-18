module.exports = {
  db: {
    name: process.env.DB_NAME || 'bamdb_dev',
    user: process.env.DB_USER || 'tilios',
    password: process.env.DB_PASSWORD || 'thefirst1',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
  },
  queries: {
    getAllTablesAndColumns:
      "select table_name,column_name from information_schema.columns where udt_catalog='bamdb_dev' AND table_schema='public'",
  },
  port: process.env.PORT || 7777,
};
