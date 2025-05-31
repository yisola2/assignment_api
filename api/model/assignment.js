let mongoose = require('mongoose');
let aggregatePaginate = require('mongoose-aggregate-paginate-v2');
let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    name: String,
    dueDate: {
        type: Date,
        set: function(value) {
            if (value && typeof value === 'object' && value.$date) {
                return new Date(value.$date);
            }
            return value;
        }
    },
    postedOn: {
        type: Date,
        set: function(value) {
            if (value && typeof value === 'object' && value.$date) {
                return new Date(value.$date);
            }
            return value;
        }
    },
    submittedOn: {
        type: Date,
        set: function(value) {
            if (value && typeof value === 'object' && value.$date) {
                return new Date(value.$date);
            }
            return value;
        }
    },
    submitted: Boolean,
    auteur: {
        nom: String,
        photo: String
    },
    matiere: {
        nom: String,
        image: String,
        prof: {
            nom: String,
            photo: String
        }
    },
    note: Number,
    remarques: String,
});

// Ajouter le plugin de pagination
AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
