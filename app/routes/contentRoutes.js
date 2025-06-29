const express = require('express');
const router = express.Router();
const knex = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
 filename: (req, file, cb) => {
  const originalName = file.originalname.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  cb(null, Date.now() + '-' + originalName.replace(/\s+/g, '_'));
}

});
const upload = multer({ storage });

// Helper pour formater l'URL
const formatImageUrl = (req, imageFilename) => {
  if (!imageFilename) return null;
  if (imageFilename.startsWith('http')) return imageFilename;
  return `${req.protocol}://${req.get('host')}/uploads/${imageFilename}`;
};

// GET tous les articles
router.get('/', async (req, res) => {
  try {
    const articles = await knex('contents')
      .leftJoin('users', 'contents.user_id', 'users.id')
      .select('contents.*', 'users.username as author');

    const formatted = articles.map(article => ({
      ...article,
      image: formatImageUrl(req, article.Image) 
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET un article
router.get('/:id', async (req, res) => {
  try {
    const article = await knex('contents')
      .leftJoin('users', 'contents.user_id', 'users.id')
      .select('contents.*', 'users.username as author')
      .where('contents.id', req.params.id)
      .first();

    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    article.image = formatImageUrl(req, article.Image);
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST - Créer un article
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, body, user_id } = req.body;
    const image = req.file ? req.file.filename : null;
console.log('Image uploadée :', image);


    await knex('contents').insert({
      title,
      body,
      Image: image,
      user_id
    });

    res.status(201).json({ message: 'Article créé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT - Modifier un article
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, body, user_id } = req.body;
    const { id } = req.params;

    const updateData = {
      title,
      body,
      updated_at: knex.fn.now()
    };

    if (req.file) {
      updateData.Image = req.file.filename;
    }

    await knex('contents').where({ id }).update(updateData);

    res.json({ message: 'Article mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE - Supprimer un article
router.delete('/:id', async (req, res) => {
  try {
    const { user_id } = req.body;
    const { id } = req.params;

    const article = await knex('contents').where({ id }).first();
    if (!article) return res.status(404).json({ message: 'Article introuvable' });

    if (parseInt(article.user_id) !== parseInt(user_id)) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (article.Image) {
      const imagePath = path.join(__dirname, '../uploads', article.Image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await knex('contents').where({ id }).del();
    res.json({ message: 'Article supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
