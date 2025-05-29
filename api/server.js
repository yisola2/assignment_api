const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const assignment = require('./routes/assignments');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const uri = 'mongodb+srv://yassyisola:Eg7Pf4e3E95XKVr5@cluster0.o7jvq.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
  })
  .catch(err => {
    console.log('Erreur de connexion: ', err);
  });

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Body parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8010;
const prefix = '/api';

// Auth routes
app.use(prefix, authRoutes);

// Assignment routes
app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(authMiddleware, assignment.postAssignment);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .put(adminAuth, assignment.updateAssignment)
  .delete(adminAuth, assignment.deleteAssignment);

// Start server
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`Serveur démarré sur http://localhost:${port}`)
);

module.exports = { app, server };