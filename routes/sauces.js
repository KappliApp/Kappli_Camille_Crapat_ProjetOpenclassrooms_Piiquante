const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

const auth = require('../middleware/Authorize');
const multer = require('../middleware/multer');

router.get('/', auth, saucesCtrl.displaySauces); // Affichage de toutes les sauces 
router.get('/:id', auth, saucesCtrl.displaySauce); // Affichage d'une sauce
router.post('/', auth, multer, saucesCtrl.createSauces); // Création d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Suppression d'une sauce
router.put('/:id', auth, multer, saucesCtrl.putSauce); // Mise à jour d'une sauce
router.post('/:id/like', auth, saucesCtrl.likesSauce); // Like ou dislike une sauce


module.exports = router;