const request = require('supertest');
const {app, server } = require('../server'); 
const mongoose = require('mongoose');

let createdAssignmentId; // Pour stocker l'id MongoDB du devoir créé

describe('Assignments API', () => {
  it('GET /api/assignments should return all assignments', async () => {
    const res = await request(app).get('/api/assignments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/assignments should create a new assignment', async () => {
    const newAssignment = {
      id: 9999,
      nom: "Test Assignment",
      dueDate: "2024-06-01",
      submitted: false,
      auteur: { nom: "Test User", photo: "url/photo.jpg" },
      matiere: {
        nom: "Test Matiere",
        image: "url/matiere.jpg",
        prof: { nom: "Prof Test", photo: "url/prof.jpg" }
      },
      note: 15,
      remarques: "Ceci est un test"
    };
    const res = await request(app)
      .post('/api/assignments')
      .send(newAssignment)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/saved/i);

    // On récupère l'id MongoDB du devoir créé pour les tests suivants
    const getRes = await request(app).get('/api/assignments');
    const created = getRes.body.find(a => a.id === 9999);
    createdAssignmentId = created ? created._id : null;
    expect(createdAssignmentId).toBeTruthy();
  });

  it('GET /api/assignments/:id should return the created assignment', async () => {
    const res = await request(app).get(`/api/assignments/${createdAssignmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Assignment");
  });

  it('PUT /api/assignments should update the assignment', async () => {
    const updatedAssignment = {
      _id: createdAssignmentId,
      nom: "Assignment Modifié",
      dueDate: "2024-07-01",
      submitted: true,
      auteur: { nom: "Test User", photo: "url/photo.jpg" },
      matiere: {
        nom: "Test Matiere",
        image: "url/matiere.jpg",
        prof: { nom: "Prof Test", photo: "url/prof.jpg" }
      },
      note: 18,
      remarques: "Mise à jour"
    };
    const res = await request(app)
      .put('/api/assignments')
      .send(updatedAssignment)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/updated/i);
  });

  it('DELETE /api/assignments/:id should delete the assignment', async () => {
    const res = await request(app).delete(`/api/assignments/${createdAssignmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  // Test de la pagination (optionnel, si tu as branché la route)
  it('GET /api/assignments?page=1&limit=5 should return paginated assignments', async () => {
    const res = await request(app).get('/api/assignments?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    // Si tu utilises aggregatePaginate, adapte ici :
    // expect(Array.isArray(res.body.docs)).toBe(true);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    server.close();
  });
});