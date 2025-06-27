module.exports = function(req, res, next) {
  console.log('Middleware auth - Session:', req.session); // Debug
  
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  
  console.log('Accès non autorisé'); // Debug
  return res.status(401).json({ 
    message: 'Non autorisé - Veuillez vous connecter' 
  });
};