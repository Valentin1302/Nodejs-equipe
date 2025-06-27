/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Si des commentaires existent avec user_id NULL, on les fixe à un utilisateur par défaut (ex: ID 1)
  await knex('comments').whereNull('user_id').update({ user_id: 1 });

  // Modifier la colonne pour la rendre NOT NULL
  return knex.schema.alterTable('comments', function(table) {
    table.integer('user_id').notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.alterTable('comments', function(table) {
    table.integer('user_id').nullable().alter();
  });
};
