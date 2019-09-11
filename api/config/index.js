module.exports = {
  db: {
    name: process.env.DB_NAME || 'bamdb_deb',
    user: process.env.DB_USER || 'tilios',
    password: process.env.DB_PASSWORD || 'thefirst1',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
  },
  queries: {
    getAllTables:
      "select table_name from information_schema.tables where table_schema = 'public' AND table_type='BASE TABLE'",
  },
  port: process.env.PORT || 7777,
  tables: {
    forms: {
      columns: ['id', 'name', 'description', 'content', 'created_at'],
    },
    leads: {
      columns: ['id', 'name', 'email', 'instagram', 'active', 'created_at'],
    },
    subscriptions: {
      columns: [
        'id',
        'status',
        'stripe_id',
        'stripe_customer',
        'last_payment_date',
        'next_payment_date',
        'canceled_at',
        'created_at',
      ],
    },
    users: {
      columns: [
        'id',
        'name',
        'display_name',
        'email',
        'phone',
        'instagram',
        'password',
        'avatar',
        'stripe_id',
        'card_company',
        'card_last4',
        'card_zip',
        'reset_token',
        'display_text',
        'created_at',
      ],
    },
  },
};
