let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    //a changer in english
    id: Number,
    name: String,
    dueDate: String,
    submitted: String,
    auteur: {
        nom: String,
        photo: String // URL ou chemin de la photo
    },
    matiere: {
        nom: String,
        image: String, // URL ou chemin de l'image
        prof: {
            nom: String,
            photo: String // URL ou chemin de la photo du prof
        }
    },
    note: Number, // sur 20
    remarques: String,
});



// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
