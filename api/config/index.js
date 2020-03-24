const dbName = process.env.DB_NAME || 'bamdb_dev';
module.exports = {
  db: {
    name: dbName,
    user: process.env.DB_USER || 'tilios',
    password: process.env.DB_PASSWORD || 'thefirst1',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
  },
  queries: {
    getAllTablesAndColumns: `select table_name,column_name from information_schema.columns where udt_catalog='${dbName}' AND table_schema='public'`,
  },
  port: process.env.PORT || 7777,
};
