const knex = require('../knexfile');
const db = require('knex')(knex.development);

module.exports = {
  getAll: () => db('users'),
  getById: (id) => db('users').where({ id }).first(),
  create: (user) => db('users').insert(user),
  delete: (id) => db('users').where({ id }).del()
};
