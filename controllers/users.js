const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/users');

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!! Fonction createUsers !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!! Création d'un utilisateur !!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.createUsers = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Hachage du mot de passe avec 10 passages
  .then(hash => {
    const User = new users({ // Création de l'utilisateur
      email : req.body.email, 
      password : hash
    });
    User.save() // Sauvegarde en bdd
    .then(() => res.status(201).json({ message : 'Utilisateur créé !' }))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
}; // Fin fonction createUsers

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Fonction loginUsers !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!! Connexion de l'utilisateur !!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.loginUsers = (req, res, next) => {
  users.findOne({ email: req.body.email }) // Récupération de l'utilisateur
  .then(user => {
    if(!user){ // Si l'utilisateur n'existe pas 
      return res.status(401).json({ error : 'Utilisateur non trouvé' });
    }
    bcrypt.compare(req.body.password, user.password) // Comparaison mot de passe haché
    .then(valid => {
      if(!valid){ // Si le mot de passe est incorrect
        return res.status(401).json({ error : 'Mot de passe incorrect' });
      }
      res.status(200).json({ // Si tout est bon 
        userId: user._id,
        token: jwt.sign(
          { userId: user._id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' } // Création du token
        )
      });
    })
    .catch(error => res.status(500).json({ error}));
  })
  .catch(error => res.status(500).json({ error }));
}; // Fin fonction login