const knex = require('../knexfile');
const db = require('knex')(knex.development);

module.exports = {
  getAll: () => db('contents'),
  getById: (id) => db('contents').where({ id }).first(),
  create: (user) => db('contents').insert(user),
  delete: (id) => db('contents').where({ id }).del()
};
