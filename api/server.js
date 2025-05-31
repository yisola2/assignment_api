const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const assignment = require('./routes/assignments');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');

const app = express();

// ------------------------------
// Connexion à la base MongoDB
// ------------------------------
mongoose.Promise = global.Promise;

const uri = 'mongodb+srv://yassyisola:Eg7Pf4e3E95XKVr5@cluster0.o7jvq.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false // note : obsolète si mongoose >= 6
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connexion à MongoDB réussie.");
  })
  .catch(err => {
    console.error("Erreur de connexion à MongoDB :", err);
  });

// ------------------------------
// Configuration CORS
// ------------------------------
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-API-Token']
}));

// Gestion explicite des requêtes préflight OPTIONS
app.options('*', cors());

// ------------------------------
// Middleware de parsing des requêtes
// ------------------------------
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------------------
// Définition des routes
// ------------------------------
const prefix = '/api';

// Routes d'authentification
app.use(prefix, authRoutes);

// Routes d'assignments
app.route(prefix + '/assignments')
  .get(assignment.getAssignmentsWithPagination)
  .post(adminAuth, assignment.postAssignment);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .put(authMiddleware, assignment.updateAssignment)
  .delete(adminAuth, assignment.deleteAssignment);

  app.post(prefix + '/populate', adminAuth, async (req, res) => {
    try {
      const Assignment = require('./model/assignment');
      const assignments = require('./data.json');
      
      console.log('Starting populate process...');
      
      // Supprimer les assignments existants
      console.log('Clearing existing assignments...');
      await Assignment.deleteMany({});
      console.log('Database cleared!');
      
      // Insérer les nouveaux assignments
      console.log('Inserting new assignments...');
      const result = await Assignment.insertMany(assignments);
      console.log(`${result.length} assignments inserted successfully!`);
      
      res.status(200).json({
        message: 'Base de données repopulée avec succès',
        count: result.length
      });
    } catch (error) {
      console.error('Erreur lors de la repopulation:', error);
      res.status(500).json({
        message: 'Erreur lors de la repopulation de la base de données',
        error: error.message
      });
    }
  });

// ------------------------------
// Démarrage du serveur
// ------------------------------
const port = process.env.PORT || 8010;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});

module.exports = { app, server };
