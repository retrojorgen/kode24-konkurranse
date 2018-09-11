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

function getFileFromPathObj (pathObj, file) {
  if(pathObj["documents"][file]) {
    return pathObj["documents"][file];
  }
    return false;
}

function getFilesFromPathObj (pathObj) {
  let documents = [];
  if(pathObj.documents) {
    documents = Object.keys(pathObj.documents);
    documents.sort();
  }
  documents = documents.map((file) => {
    return {
      type: "regular",
      content: file
    }
  });
  return documents;
}

function getFoldersFromPathObj (pathObj) {
  let folders = [];
  if(pathObj.folders) {
    folders = Object.keys(pathObj.folders);
    folders.sort();
  }
  folders = folders.map((folder) => {
    return {
      type: "regular",
      content: folder + "\\"
    }
  }); // append / to all for pretty printing
  return folders;
}

function getContentsFromPath (path) {
  let pathObj = files[path[0]]; // root path
  if(path.length > 1) { // we have subpath
    for (let x = 1; x < path.length; x++) { // skip home path
        if(pathObj["folders"][path[x]]) { // repeat until we reach correct path
          pathObj = pathObj["folders"][path[x]];
        } else {
          // we have a path that does not exist return false
          return false;
        }
    }
  }
  // we have successfully found a path, return it!
  
  return pathObj;
}


function parseFileSystemRequest(path, command, file) {
  let pathObj = getContentsFromPath(path);
  if(pathObj) {
    if(command) {
      switch (command) {
        case "dir":
          return getFoldersFromPathObj(pathObj).concat(getFilesFromPathObj(pathObj));
          break;
        case "print":
        
        if(file) {
          return getFileFromPathObj(pathObj, file);
        } else {
          return false;
        }
        default:
          // can not interpret command
          return false;    
      }
    } else {
      return path;
    }
  } else {
    // path does not exist
    return false;
  }

}

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

app.get('/api/filesystem/home/', (req, res) => {
  let response = parseFileSystemRequest(["home"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
  }
});

app.get('/api/filesystem/home/img', (req, res) => {
  let response = parseFileSystemRequest(["home", "img"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
  }
});

app.get('/api/filesystem/home/sms', (req, res) => {
  let response = parseFileSystemRequest(["home", "sms"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
  }
});

app.get('/api/filesystem/home/www', (req, res) => {
  let response = parseFileSystemRequest(["home", "www"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
  }
});

app.get('/api/webstart/', (req, res) => {
  let command = req.query.command;
  let passwords = [
    "Steinar Schjøtt",
    "Halfdan Christensen",
    "Jan Njerve",
    "Bjørg Vik",
    "Kalle Zwilgmeyer",
    "Kjell Thorjussen",
    "Ulla-Mari Brantenberg",
    "Tommy Sørbø",
    "Hilde Vemren,",
    "Lars Vik",
    "Tor Arne Ursin",
    "Anders Vangen",
    "Audun Kleive",
    "Kjersti Wold",
    "Bård Henrik Bosrup",
    "Gunilla Sussmann,",
    "Fredrik Brattberg,",
    "Jan Erik Fillan",
    "Kjetil Aleksander Lie",
    "Kristoffer Olsen",
    "Aleksander Walmann",
    "Didrik Solli-Tangen",
  ];

  let randomCelebrity = Math.floor(Math.random()*((passwords.length-0)-0+1)+0);
  if(command === "chopsoy-julie-hydro") {
    res.json([
      {"type": "regular", "content": "WEBSERVER KJØRER!"},
      {"type": "regular", "content": "* AUTH KODE:" + passwords[randomCelebrity] + " er Porsgrunns stolthet!"},
      {"type": "regular", "content": "** Send auth-koden og adressen din til hei@kode24.no,"},
      {"type": "regular", "content": "** Så fårru no artig i posten!"},
      {"type": "regular", "content": "*** Obs! Gjelder så langt lageret rekker."},
      {"type": "regular", "content": "***      Kun en levering per addresse."},
    ]);
  } else {
    res.status(401).json({})
  }
});

app.get('/api/filesystem/home/www/kode24', (req, res) => {
  let response = parseFileSystemRequest(["home", "www", "kode24"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
  }
});

app.get('/api/filesystem/home/www/caesar-fans', (req, res) => {
  let response = parseFileSystemRequest(["home", "www", "caesar-fans"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
  }
});


app.get('/api/filesystem/home/www/altinn', (req, res) => {
  console.log('got here');
  let response = parseFileSystemRequest(["home", "www", "altinn"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
  }
});



app.get('/api/filesystem/home/www/', (req, res) => {
  let response = parseFileSystemRequest(["home", "www"], req.query.command, req.query.file);
  if(response) {
    res.json(response);
  } else {
    res.status(401).json({})
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