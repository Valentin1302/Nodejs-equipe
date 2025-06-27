const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const voteRoutes = require('./routes/voteRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();

// Configuration CORS améliorée
app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuration de session améliorée
app.use(session({
  secret: 'motSecretUltraSecurisé',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // true en production avec HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Middleware pour logger les sessions (debug)
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes publiques
app.use('/auth', authRoutes);

// Routes protégées
app.use('/users', authMiddleware, userRoutes);
app.use('/contents', contentRoutes);
app.use('/comments', authMiddleware, commentRoutes);
app.use('/votes', authMiddleware, voteRoutes);

// Route de test de session
app.get('/check-session', (req, res) => {
  res.json({ session: req.session });
});

// Redirection par défaut
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));