const db = require('./database/db');

(async () => {
  await db('users').insert({ username: 'admin', password: '1234' });
  await db('contents').insert({ title: 'Article test', body: 'Contenu test', user_id: 1 });
  console.log('Données insérées');
})();
