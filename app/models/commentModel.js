const knex = require('../knexfile');
const db = require('knex')(knex.development);

module.exports = {
  getAll: () => db('comments'),
  getById: (id) => db('comments').where({ id }).first(),
  create: (user) => db('comments').insert(user),
  delete: (id) => db('comments').where({ id }).del()
};
