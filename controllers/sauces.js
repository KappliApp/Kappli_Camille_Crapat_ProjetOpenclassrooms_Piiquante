const sauces = require('../models/sauces'); // Récupération du modèle de bdd
const fs = require('fs');

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!! Fonction displaySauces !!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!! Retourne toutes les sauces !!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.displaySauces = (req, res, next) => { 
    sauces.find() // Récupération des sauces
    .then(sauces => res.status(200).json(sauces)) // Affichage 
    .catch(error => res.status(400).json({ error })); // Erreur en cas de problème
}; // Fin fonction displaySauces

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!! Fonction displaySauce !!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Retourne une sauce !!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.displaySauce = (req, res, next) => {
  sauces.findOne({_id: req.params.id,}) // Récupération des données par l'id
  .then((sauce) => {res.status(200).json(sauce);}) // Affichage du résultat
  .catch((error) => {res.status(404).json({error: error});}); // Affichage d'un message d'erreur en cas de problème
}; // Fin fonction displaySauce

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!! Fonction createSauces !!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!! Créer une sauce !!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.createSauces = (req, res, next) => {
  const sauce = JSON.parse(req.body.sauce); // Récuopération des données envoyé par le front
  delete sauce._id; // Suppression de l'id attribué par le front
  const Sauces = new sauces({ // Objet sauce
    userId: sauce.userId,
    name: sauce.name,
    manufacturer: sauce.manufacturer,
    description: sauce.description,
    mainPepper: sauce.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
    heat: sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [], 
    usersDisliked: []
  });
  Sauces.save() // Sauvegarde de la sauce 
  .then(() => res.status(201).json({ message : 'Sauce créé !' })) // Renvoi un message si succès
  .catch(error => res.status(400).json({ error })); // Renvoi une erreur en cas de problème
}; // Fin fonction createSauces

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!! Fonction putSauce !!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!! Modification d'une sauce !!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.putSauce = (req, res, next) => {
  let sauceFile = req.file; // Récupération du fichier dans la requête
  if(sauceFile != undefined){ // Si le fichier à été modifié 
    let sauceObj = JSON.parse(req.body.sauce); // Récupération des informations de la sauce
    sauces.findOne({_id: req.params.id},) 
    .then((sauce) => {
      if(sauce.userId === sauceObj.userId){ // Si l'utilisateur est le créateur de la sauce alors on accepte la modification
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {  // Suppression de l'ancienne image
          sauces.updateOne({_id: req.params.id}, {
          userId: sauceObj.userId,
          name: sauceObj.name,
          manufacturer: sauceObj.manufacturer,
          description: sauceObj.description,
          mainPepper: sauceObj.mainPepper,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
          heat: sauceObj.heat
          })
          .then(() => res.status(200).json({ message: "Sauce modifiée" })) // Si pas d'erreur on renvoi un message 
          .catch(error => res.status(400).json({ error })); // Renvoi d'une erreur en cas de problème
        });
      }
      else{ // Sinon on renvoi une erreur 
        res.status(403).json({ message : "Vous n'êtes pas autorisé à modifier cette sauce !"});
      }
    })
    .catch(error => res.status(500).json({ error }));
  }
  else{
    sauces.findOne({_id: req.params.id},)
    .then((sauce) => {
      if(sauce.userId === req.body.userId){
        sauces.updateOne({_id: req.params.id}, { // Si l'image n'a pas été modifié 
          userId: req.body.userId,
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          mainPepper: req.body.mainPepper,
          imageUrl: req.body.imageUrl, 
          heat: req.body.heat
        })
        .then(() => res.status(200).json({ message: "Sauce modifiée" }))
        .catch(error => res.status(400).json({ error}));   
      }
      else{
        res.status(403).json({ message : "Vous n'êtes pas autorisé à modifier cette sauce !"});
      }
    })
    .catch(error => res.status(500).json({ error }));    
  }
}; // Fin fonction putSauce

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!! Fonction deleteSauce !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!! Suppression d'une sauce !!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.deleteSauce = (req, res, next) => { 
  sauces.findOne({_id: req.params.id,}) // Récupération des données d'une sauce
  .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => { // Suppression de l'image de la sauce
      sauces.deleteOne({_id: req.params.id,}) // Suppression de la sauce
      .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
      .catch(error => res.status(400).json({ error }));
  });
})
.catch(error => res.status(500).json({ error }));
}; // Fin fonction deleteSauce

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! Fonction likesSauce !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!! Like / Dislike !!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.likesSauce = (req, res, next) => {
  let userId = req.body.userId; // Récupération de l'id de l'utilisateur
  let like = req.body.like; // Récupération du like

  sauces.findOne({_id: req.params.id,})
  .then((sauce) => {
    let userLike = sauce.usersLiked.indexOf(userId); // Récupération des users like de la bdd
    let userDislike = sauce.usersDisliked.indexOf(userId); // Récupération des users dislike de la bdd
    let message = "message"; // Déclaration du message
    if(like === 0 && userLike > -1){ // Si le like est de 0 et que l'utilisateur aimait la sauce
      sauce.likes--; // On réduit les likes
      sauce.usersLiked.splice(userLike,1); // On supprime l'id de l'utilisateur des like
      message = "Votre j'aime a été supprimé !" 
    }
    else if(like === 0 && userDislike > -1){ // Si le like est de 0 et que l'utilisateur n'aimait pas la sauce
      sauce.dislikes--; // On réduit les dislikes
      sauce.usersDisliked.splice(userDislike,1); // On supprime l'id de l'utilisateur des dislike
      message = "Votre je n'aime pas a été supprimé !"
    }
    if(like === 1){ // Si l'utilisateur aime la sauce
      if(userDislike !== -1){ // Si il n'aimait pas la sauce
        sauce.dislikes--; // On réduit les dislike
        sauce.usersDisliked.splice(userDislike, 1); // On enlève l'id de l'utilisateur des dislike
      }
      sauce.likes++; // On ajoute un like
      sauce.usersLiked.push(userId); // On ajoute l'id de l'utilisateur au like
      message = "Vous aimez cette sauce !"
    }
    if(like === -1){ // Si l'utilisateur n'aime pas la sauce
      if(userLike !== -1){ // Si il aimait cette sauce
        sauce.likes--; // On réduit les j'aime
        sauce.usersLiked.splice(userLike, 1); // On supprime l'id de l'utilisateur des like
      }
      sauce.dislikes++; // On ajoute un dislike
      sauce.usersDisliked.push(userId); // On ajoute l'id de l'utilisateur au dislike
      message = "Vous n'aimez pas cette sauce !"
    }
    sauce.save() // On sauvegarde
    .then(() => res.status(200).json({ message: message }))
    .catch(error => res.status(400).json({error}));
  })
  .catch(error => res.status(400).json({ error }));
}; // Fin fonction likeSauce