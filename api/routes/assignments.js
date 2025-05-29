let Assignment = require('../model/assignment');
const mongoose = require('mongoose');


function getAssignmentsWithPagination(req, res) { 
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    };

    Assignment.aggregatePaginate({}, options, (err, result) => {  
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
}




// Récupérer tous les assignments (GET)
function getAssignments(req, res){
  Assignment.find((err, assignments) => {
      if(err){
          res.send(err)
      }
      // Convert string dates to proper dates before sending
      const processedAssignments = assignments.map(a => {
          if (a.dueDate && typeof a.dueDate === 'string' && a.dueDate.includes('/')) {
              const [day, month, year] = a.dueDate.split('/');
              a.dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          }
          return a;
      });
      res.send(processedAssignments);
  });
}


// GET /api/assignments/:id
async function getAssignment(req, res) {
    const { id } = req.params;
    // Vérification rapide du format ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide.' });
    }
  
    try {
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: 'Devoir non trouvé.' });
      }
      if (assignment.dueDate && typeof assignment.dueDate === 'string' && assignment.dueDate.includes('/')) {
        const [day, month, year] = assignment.dueDate.split('/');
        assignment.dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      res.status(200).json(assignment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  }

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.name = req.body.nom || req.body.name; // Support both nom and name
    assignment.dueDate = req.body.dueDate;
    assignment.submitted = req.body.submitted;
    assignment.auteur = req.body.auteur; // { nom, photo }
    assignment.matiere = req.body.matiere; // { nom, image, prof: { nom, photo } }
    assignment.note = req.body.note;
    assignment.remarques = req.body.remarques;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.name} saved!`})
    })
}

// Update d'un assignment (PUT)
// PUT /api/assignments/:id ou PUT /api/assignments (avec _id dans le body)
async function updateAssignment(req, res) {
    const id = req.params.id || req.body._id; // Utilise 'id' partout
    if (!id) {
      return res.status(400).json({ message: 'ID manquant.' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide.' });
    }
    try {
      const updated = await Assignment.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ message: 'Devoir non trouvé.' });
      }
      res.status(200).json({ message: 'Assignment updated successfully', assignment: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  }
  
  // DELETE /api/assignments/:id
  async function deleteAssignment(req, res) {
    const id = req.params.id; // Utilise 'id' (et non _id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide.' });
    }
    try {
      const deleted = await Assignment.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Devoir non trouvé.' });
      }
      res.status(200).json({ message: 'Assignment deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
}
  



module.exports = { getAssignment,   
                   getAssignmentsWithPagination,
                   postAssignment,
                   updateAssignment,
                   deleteAssignment,
                   getAssignments
                 };
