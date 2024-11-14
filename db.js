
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
});

module.exports = sequelize;









































































// // db.js
// const mysql = require('mysql2');

// // Créer une connexion à la base de données
// const connection = mysql.createConnection({
//   host: 'localhost', // Remplace par l'hôte de ta base de données
//   user: 'root', // Remplace par ton nom d'utilisateur MySQL
//   password: '', // Remplace par ton mot de passe MySQL
//   database: 'api' // Remplace par le nom de ta base de données
// });

// // Connecter à la base de données
// connection.connect(err => {
//   if (err) {
//     console.error('Erreur de connexion à la base de données :', err.stack);
//     return;
//   }
//   console.log('Connecté à la base de données MySQL en tant que ID', connection.threadId);
// });


