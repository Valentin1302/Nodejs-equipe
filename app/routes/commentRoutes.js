const express = require('express');
const router = express.Router();
const knex = require('../db');
const auth = require('../middleware/auth'); // middleware d'authentification

// Récupérer les commentaires d'un article avec l'ID de l'auteur de l'article
router.get('/:articleId', async (req, res) => {
  const { articleId } = req.params;

  try {
    // Récupérer l'article pour avoir son auteur
    const article = await knex('contents').where({ id: articleId }).first();
    if (!article) return res.status(404).json({ message: 'Article introuvable' });

    // Récupérer les commentaires liés à cet article
    const comments = await knex('comments')
      .where({ content_id: articleId })
      .select(
        'id',
        'body as content',
        'author',
        'user_id',
        'parent_id',
        'created_at as date'
      );

    // Ajouter article_author_id à chaque commentaire pour la logique frontend
    const commentsWithAuthor = comments.map(c => ({
      ...c,
      article_author_id: article.user_id
    }));

    res.json(commentsWithAuthor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter un commentaire (requiert authentification)
router.post('/:articleId', auth, async (req, res) => {
  const { articleId } = req.params;
  const { content, parent_id } = req.body;

  const user_id = req.user.id;
  const author = req.user.username;

  if (!content) return res.status(400).json({ message: 'Commentaire vide' });

  try {
    const [id] = await knex('comments').insert({
      content_id: articleId,
      body: content,
      author,
      parent_id: parent_id || null,
      user_id,
      created_at: knex.fn.now()
    });

    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un commentaire (seul l'auteur du commentaire ou l'auteur de l'article peut supprimer)
router.delete('/:id', auth, async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const comment = await knex('comments').where({ id: commentId }).first();
    if (!comment) return res.status(404).json({ message: 'Commentaire introuvable' });

    const article = await knex('contents').where({ id: comment.content_id }).first();
    if (!article) return res.status(404).json({ message: 'Article introuvable' });

    // Vérifier si l'utilisateur est autorisé à supprimer
    if (comment.user_id !== userId && article.user_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire' });
    }

    await knex('comments').where({ id: commentId }).del();
    res.status(200).json({ message: 'Commentaire supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
