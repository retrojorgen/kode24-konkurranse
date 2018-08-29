const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const files = require('./files.js');
const app = express();


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Put all API endpoints under '/api'
app.get('/api/test', (req, res) => {
  res.json({title: "kode24"});
});
/**
app.get('/api/help', (req, res) => {
  res.json(
    [
      {type: "regular", content: "!! NO INCLUDING OF PERCENTAGE, THANK YOU"},
      {type: "regular", content: "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"},
      {type: "regular", content: "* LIST %DIRECTORY% - LIST THE CONTENTS OF SELF"},
      {type: "regular", content: "* CD %DIRECTORY% - ENTER MY DIRECTORIES"},
      {type: "regular", content: "* CD .. - MOVE UP TO DIRECTORY"},
      {type: "regular", content: "* PRINT %FILE% - OUTPUT CONTENT OF THE FILES"},
      {type: "regular", content: "* CONTACT %FILE%  - SPECIAL VIEW FOR .CT FILES"},
      {type: "regular", content: "* RUN %FILE%  - RUN .HU EXECUTABLE FILES"},
      {type: "regular", content: "* CLEAR - WHEN IT GETS MESSY"},
      {type: "regular", content: "* HELP - GET HIELP"}
    ]
  );
}); */

app.get('/api/help', (req, res) => {
  res.json(
    [
      {type: "regular", content: "!! NO INCLUDING OF PERCENTAGE, THANK YOU"},
      {type: "regular", content: "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"},
      {type: "regular", content: "* LIST - LIST THE CONTENTS OF SELF"},
      {type: "regular", content: "* CD %DIRECTORY% - ENTER MY DIRECTORIES"},
      {type: "regular", content: "* CD .. - MOVE UP TO DIRECTORY"},
      {type: "regular", content: "* PRINT %FILE% - OUTPUT CONTENT OF THE FILES"},
      {type: "regular", content: "* CONTACT %FILE%  - SPECIAL VIEW FOR .CT FILES"},
      {type: "regular", content: "* PHOTO %FILE%  - SPECIAL VIEW FOR .PHOTO FILES"},
      {type: "regular", content: "* RUN %FILE%  - RUN .HU EXECUTABLE FILES"},
      {type: "regular", content: "* HELP - GET HIELP"}
    ]
  );
});

app.get('/api/filesystem/home/', (req, res) => {
  switch (req.query.command) {
    case "list":
      res.json([
        {type: "regular", content: "Total 6"},
        {type: "regular", content: "../"},
        {type: "regular", content: "WWW/"},
        {type: "regular", content: "CONTACTS/"},
        {type: "regular", content: "PHOTOS/"},
        {type: "regular", content: "DOCUMENTS/"},
        {type: "regular", content: "WEBCONFIG.TXT"},
        {type: "regular", content: "CUSTOMERS.TXT"}
      ]);
      break;
    default:
      res.json(
        {
          path: ["home"], 
        }
      );
      break;
  }
});

app.get('/api/filesystem/home/photos', (req, res) => {
  switch (req.query.command) {
    case "list":
      res.json([
        {type: "regular", content: "Total 1"},
        {type: "regular", content: "../"}
      ]);
      break;
    default:
      res.json(
        {
          path: ["home", "photos"], 
        }
      );
      break;
  }
});

app.get('/api/filesystem/home/documents', (req, res) => {
  switch (req.query.command) {
    case "list":
      res.json([
        {type: "regular", content: "Total 1"},
        {type: "regular", content: "../"}
      ]);
      break;
    default:
      res.json(
        {
          path: ["home", "documents"], 
        }
      );
      break;
  }
});

app.get('/api/filesystem/home/contacts', (req, res) => {
  switch (req.query.command) {
    case "list":
      res.json([
        {type: "regular", content: "Total 1"},
        {type: "regular", content: "../"}
      ]);
      break;
    default:
      res.json(
        {
          path: ["home", "contacts"], 
        }
      );
      break;
  }
});



app.get('/api/filesystem/home/www/', (req, res) => {
  switch (req.query.command) {
    case "list":
      res.json([
        {type: "regular", content: "Total 2"},
        {type: "regular", content: "../"},
        {type: "regular", content: "KODE24/"},
        {type: "regular", content: "DATE_MY_THIRD_COUSIN/"},
      ]);
      break;
    default:
      res.json(
        {
          path: ["home","www"]
        }
      );
      break;
  }
});

app.get('/api/filesystem/home/www/kode24/', (req, res) => {

  switch (req.query.command) {
    case "list":
      res.json([
        {type: "regular", content: "Total 1"},
        {type: "regular", content: "../"},
        {type: "regular", content: "INDEX.HTML"},
      ]);
      break;
    default:
      res.json(
        {
          path: ["home","www", "kode24"]
        }
      );
      break;
  }
});

app.get('/api/filesystem/home/www/date_my_third_cousin/', (req, res) => {

  switch (req.query.command) {
    case "list":
      res.json([
        {type: "regular", content: "Total 1"},
        {type: "regular", content: "../"},
        {type: "regular", content: "INDEX.HTML"},
      ]);
      break;
    default:
      res.json(
        {
          path: ["home","www", "date_my_third_cousin"]
        }
      );
      break;
  }
});

app.get('/api/filesystem/*', (req, res) => {
  res.status(401).json({});
});


app.post('/api/email', (req, res) => {
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`listening on ${port}`);




var http = require("http");

setInterval(function() {
    http.get("http://kode24-code.herokuapp.com/");
}, 300000); // every 5 minutes (300000)