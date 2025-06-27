/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('votes', function(table) {
    table.increments('id').primary();
    table.integer('content_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.enum('type', ['like', 'dislike']).notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('votes');
};
