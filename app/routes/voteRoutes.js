const express = require('express');
const router = express.Router();
const knex = require('../db');

// Version de debug - revenons à l'ancienne méthode temporairement
router.post('/:id/vote', async (req, res) => {
  console.log('=== DEBUG VOTE ===');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('==================');

  const { id } = req.params;
  const { user_id, type } = req.body;

  // Si user_id n'est pas dans le body, essayons de le récupérer depuis la session
  let finalUserId = user_id;
  if (!finalUserId) {
    finalUserId = req.session?.userId || req.session?.user_id || req.user?.id;
    console.log('User ID récupéré depuis session/user:', finalUserId);
  }

  if (!finalUserId || !['like', 'dislike'].includes(type)) {
    console.log('Données invalides:', { finalUserId, type });
    return res.status(400).json({ message: 'Données invalides' });
  }

  try {
    console.log('Recherche vote existant pour:', { content_id: id, user_id: finalUserId });
    
    const existing = await knex('votes').where({ content_id: id, user_id: finalUserId }).first();
    console.log('Vote existant trouvé:', existing);

    if (existing) {
      if (existing.type === type) {
        // Toggle off - supprimer le vote
        console.log('Suppression du vote existant');
        await knex('votes').where({ content_id: id, user_id: finalUserId }).del();
      } else {
        // Changer le type de vote
        console.log('Mise à jour du type de vote');
        await knex('votes').where({ content_id: id, user_id: finalUserId }).update({ type });
      }
    } else {
      // Nouveau vote
      console.log('Insertion nouveau vote');
      await knex('votes').insert({ content_id: id, user_id: finalUserId, type });
    }

    // Renvoyer les nouveaux totaux
    console.log('Calcul des totaux pour content_id:', id);
    const votes = await knex('votes').where({ content_id: id });
    console.log('Tous les votes:', votes);
    
    const likes = votes.filter(v => v.type === 'like').length;
    const dislikes = votes.filter(v => v.type === 'dislike').length;
    
    console.log('Totaux:', { likes, dislikes });

    res.status(200).json({ likes, dislikes });
  } catch (err) {
    console.error('ERREUR DANS LA ROUTE VOTE:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir les votes d'un contenu
router.get('/:id/votes', async (req, res) => {
  const { id } = req.params;

  try {
    const votes = await knex('votes').where({ content_id: id });

    const likes = votes.filter(v => v.type === 'like').length;
    const dislikes = votes.filter(v => v.type === 'dislike').length;

    res.json({ likes, dislikes });
  } catch (err) {
    console.error('Erreur lors de la récupération des votes:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;