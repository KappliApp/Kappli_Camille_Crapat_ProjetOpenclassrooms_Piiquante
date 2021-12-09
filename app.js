const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const saucesRoutes = require('./routes/sauces');
const path = require('path');

const app = express();

// Connexion base de donnée

mongoose.connect('mongodb+srv://si56gh_7:N_8bVF5t@hot-takes.n3vru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// Entête API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))); // Affichage des images
app.use('/api/auth', usersRoutes); // Routes users
app.use('/api/sauces', saucesRoutes);  // Route sauces

module.exports = app;