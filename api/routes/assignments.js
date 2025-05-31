let Assignment = require('../model/assignment');
const mongoose = require('mongoose');

// GET /api/assignments avec pagination
function getAssignmentsWithPagination(req, res) { 
    // Paramètres de pagination depuis l'URL
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-dueDate'; // Tri par date décroissante par défaut
    
    // Options pour la pagination
    const options = {
        page: page,
        limit: limit,
        sort: { dueDate: -1 }, // Tri par date décroissante
        customLabels: {
            totalDocs: 'totalAssignments',
            docs: 'assignments',
            limit: 'pageSize',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'pageCount',
            hasPrevPage: 'hasPrev',
            hasNextPage: 'hasNext',
            pagingCounter: 'slNo',
            meta: 'paginator'
        }
    };

    // filters???
    const aggregate = Assignment.aggregate([
        // Optionnel : Ajouter des filtres
        // { $match: { submitted: { $ne: 'Oui' } } }, // Par exemple, seulement les non-soumis
        
        // Optionnel : Ajouter des projections
        {
            $project: {
                _id: 1,
                id: 1,
                name: 1,
                dueDate: 1,
                postedOn: 1,
                submitted: 1,
                auteur: 1,
                matiere: 1,
                note: 1,
                remarques: 1
            }
        }
    ]);

    Assignment.aggregatePaginate(aggregate, options, (err, result) => {  
        if (err) {
            console.error('Erreur pagination:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des assignments' });
        }
        
        console.log(`[PAGINATION] Page ${result.currentPage}/${result.pageCount} - ${result.assignments.length} assignments`);
        res.json(result);
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
    assignment.postedOn = req.body.postedOn
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
// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
  let id = req.params.id || req.body._id;
  if (!id) {
    return res.status(400).json({ message: 'ID manquant.' });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalide.' });
  }

  const isAdmin = req.user && req.user.role === 'admin';

  let updateFields;
  if (isAdmin) {
    updateFields = req.body;
  } else {
    updateFields = {};
    if (typeof req.body.submitted !== 'undefined') {
      updateFields.submitted = req.body.submitted;
    }
    if (req.body.auteur) {
      updateFields.auteur = req.body.auteur;
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(403).json({ message: 'Non autorisé à modifier d\'autres champs.' });
    }
  }

  try {
    const updated = await Assignment.findByIdAndUpdate(id, updateFields, { new: true });
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
