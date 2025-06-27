const knex = require('../db');

exports.createComment = async (req, res) => {
  try {
    const { content, parent_id } = req.body;
    const article_id = req.params.articleId;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const [comment] = await knex('comments').insert({
      content,
      article_id,
      parent_id: parent_id || null,
      user_id: req.user.id,
      date: new Date(),
      likes: 0,
      dislikes: 0
    }).returning('*');

    // Ajoutez le nom d'utilisateur à la réponse
    comment.author = req.user.username;
    
    res.status(201).json(comment);
  } catch (err) {
    console.error('Erreur création commentaire:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    
    const comments = await knex('comments')
      .select(
        'comments.*',
        'users.username as author'
      )
      .where({ article_id: articleId })
      .leftJoin('users', 'comments.user_id', 'users.id')
      .orderBy('date', 'asc');

    res.json(comments);
  } catch (err) {
    console.error('Erreur récupération commentaires:', err);
    res.status(500).json({ error: err.message });
  }
};