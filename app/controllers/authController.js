const bcrypt = require('bcrypt');
const knex = require('../db'); 

exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await knex('users').insert({ username, password: hash });

        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await knex('users').where({ username }).first();

    if (!user) {
      return res.status(400).json({ message: 'Nom d’utilisateur invalide' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Stockage de l'utilisateur dans la session
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.json({ message: 'Connexion réussie', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkAuth = async (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  return res.status(401).json({ authenticated: false });
};

