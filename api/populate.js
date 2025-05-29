const mongoose = require('mongoose');
const Assignment = require('./model/assignment');
const assignments = require('./data.json');

const uri = 'mongodb+srv://yassyisola:Eg7Pf4e3E95XKVr5@cluster0.o7jvq.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // First, clear the existing assignments
    console.log('Clearing existing assignments...');
    await Assignment.deleteMany({});
    console.log('Database cleared!');
    
    // Then, insert the new assignments
    console.log('Inserting new assignments...');
    await Assignment.insertMany(assignments);
    console.log('Assignments inserted successfully!');
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
  });