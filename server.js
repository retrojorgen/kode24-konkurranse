const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const files = require('./files.js');
const app = express();


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/api/help', (req, res) => {
  res.json(
    [
      {type: "regular", content: "!! TOMS DATAMASKIN, HJÆLPEDOKUMENT"},
      {type: "regular", content: "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"},
      {type: "regular", content: "* DIR - LIST UT INHOLD I MAPPA DU ER I"},
      {type: "regular", content: "* CD %DIRECTORY% - BYTT TIL EI MAPPE INNI MAPPA"},
      {type: "regular", content: "* CD.. - FLØTT OPP EI MAPPE"},
      {type: "regular", content: "* PRINT %FILE% - SKRIV UT EI AV FILANE"},
      {type: "regular", content: "* HELP - FÅ HJÆLP"}
    ]
  );
});

function getPath (path) {
  if(files[path])
    return files[path];
  else
    return false;  
};

app.post('/api/filesystem/', (req, res) => {
  var pathRequest = req.body.path;
  var pathContent = getPath(pathRequest);
  if(pathContent) {
    res.send(pathContent)
  } else {
    res.send(404, {});
  }
});

app.post('/api/file', (req,res) => {
  console.log('hest', req.body);
  var path = req.body.path;
  var fileName = req.body.fileName;
  fs.open('files/DES-01/d1quiz.txt', 'r', (err, fd) => {
    if (err) throw err;

    res.send(fd);

    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

var http = require("http");

setInterval(function() {
    http.get("http://kode24-signup.herokuapp.com/");
    
}, 300000); // every 5 minutes (300000)