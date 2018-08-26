const config = require('convict')({
  host: {
    doc: 'Database host',
    default: 'localhost',
    env: 'DB_HOST',
  },
  port: {
    doc: 'Database port',
    default: 3306,
    env: 'DB_PORT',
  },
  database: {
    doc: 'Database to use',
    default: 'blog',
    env: 'DB_DATABASE',
  },
  user: {
    doc: 'Database user',
    default: 'username',
    env: 'DB_USER',
  },
  password: {
    doc: 'Database password for supplied user',
    default: 'password',
    env: 'DB_PASSWORD',
  },
});

module.exports = {
  client: 'mysql2',
  connection: {
    host: config.get('host'),
    database: config.get('database'),
    user: config.get('user'),
    password: config.get('password'),
    port: config.get('port'),
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};
