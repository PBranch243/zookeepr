const express = require('express');
const { animals } = require('./data/animals.json');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');

//make public folder accessible so html can acces its css and javascript
app.use(express.static('public'));

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());


app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();
  //if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)){
    res.status(400).send('The animal is not properly formatted.');
  }else{
  //add animal to json file and animals array in this funcion
  const animal = createNewAnimal(req.body, animals);
  res.json(req.body);
  }
});

//send homepage to browser
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//send animals page to browser
app.get('/animals',(req,res)=>{
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

//send zookeeper page to browser
app.get('/zookeepers',(req,res)=>{
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//add a wildcard route to redirect non-existant routes to homepage
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API Server now on port ${PORT}!`);
});

// console.log (animals);
