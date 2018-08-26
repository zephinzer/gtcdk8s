exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', (posts) => {
    posts.increments('id').unsigned().primary();
    posts.text('content');
    posts.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
    posts.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
