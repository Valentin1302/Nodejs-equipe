/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('comments', function(table) {
    table.increments('id').primary();
    table.text('content').notNullable(); 
    table.boolean('like').defaultTo(false);  
    table.boolean('dislike').defaultTo(false);
    table.text('author').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('content_id').unsigned().references('id').inTable('contents').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('comments');
};
