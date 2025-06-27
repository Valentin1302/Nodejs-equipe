// routes/contentRoutes.js (corrigé)
const express = require('express');
const router = express.Router();
const knex = require('../db');

// Obtenir tous les articles
router.get('/', async (req, res) => {
  try {
    const articles = await knex('contents');
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir un seul article avec le nom d’auteur
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const article = await knex('contents')
      .leftJoin('users', 'contents.user_id', 'users.id')
      .select('contents.*', 'users.username as author')
      .where('contents.id', id)
      .first();

    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    res.json(article);
  } catch (err) {
    console.error('Erreur récupération article :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Création d'un article
router.post('/', async (req, res) => {
  const { title, body, user_id } = req.body;
  if (!title || !body || !user_id) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    await knex('contents').insert({ title, body, user_id });
    res.status(201).json({ message: 'Article créé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mise à jour
router.put('/:id', async (req, res) => {
  const { title, body, user_id } = req.body;
  const { id } = req.params;

  const article = await knex('contents').where({ id }).first();
  if (!article) return res.status(404).json({ message: 'Article introuvable' });

  if (parseInt(article.user_id) !== parseInt(user_id)) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  await knex('contents').where({ id }).update({
    title,
    body,
    updated_at: knex.fn.now()
  });

  res.json({ message: 'Article mis à jour' });
});

// Suppression
router.delete('/:id', async (req, res) => {
  const { user_id } = req.body;
  const { id } = req.params;

  const article = await knex('contents').where({ id }).first();
  if (!article) return res.status(404).json({ message: 'Article introuvable' });

  if (parseInt(article.user_id) !== parseInt(user_id)) {
    return res.status(403).json({ message: 'Non autorisé' });
  }

  await knex('contents').where({ id }).del();
  res.json({ message: 'Article supprimé' });
});

module.exports = router;
