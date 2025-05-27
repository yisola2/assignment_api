const mongoose = require('mongoose');
const Assignment = require('./model/assignment');
const assignments = require('./data.json');

const uri = 'mongodb+srv://yassyisola:Eg7Pf4e3E95XKVr5@cluster0.o7jvq.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await Assignment.insertMany(assignments);
    console.log('Assignments inserted!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
  });