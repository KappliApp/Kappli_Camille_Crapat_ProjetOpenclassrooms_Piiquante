const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');

router.post('/signup', usersCtrl.createUsers); // Inscription de l'utilisateur
router.post('/login', usersCtrl.loginUsers); // Connexion de l'utilisateur


module.exports = router;