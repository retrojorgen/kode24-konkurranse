
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const files = require('./files.js')
const db = require('./db.js');
const app = express()


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())
 
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
  )
})

function getPath (path) {
  if(files[path])
    return files[path];
  else
    return false;  
}

function getPathCode (path) {
  if(files[path] && files[path].passphrase) {
      return files[path].passphrase
  } else {
    return false;
  }
}


function getFile (path, fileName) {
  if(files[path]) {
    for(let x = 0; x<=files[path].files.length -1; x++) {
      if(files[path].files[x].name === fileName.toLowerCase()) {
        return files[path].files[x];
      }
    }
  }
  return false;
}

app.post('/api/filesystem/', (req, res) => {
  let pathRequest = req.body.path;
  let pathContent = getPath(pathRequest);
  if(pathContent) {
    res.send(pathContent)
  } else {
    res.send(404, {});
  }
})

app.post('/api/code', async (req,res) => {
  let path = req.body.path;
  let code = req.body.code;
  let codeFromFileSystem = getPathCode(path, code);
  let competitionDate = new Date(getPath(path).availableFrom);
  let todaysDate = new Date();

  
    if(code.toLowerCase() === codeFromFileSystem.toLowerCase() && req.cookies.id) {
        let answer = await db.AddAnswer(path, req.cookies.id, (todaysDate.getDate() === competitionDate.getDate()));

        if(answer === 1) {
          res.send({
            type: "txt", content: ["Riktig! Du er med i dagens trekning!"]
          });
        } 
        if(answer === 2) {
          res.send({
            type: "txt", content: ["Du er allerede med i trekningen"]
          });
        }
        if(answer === 3) {
          res.send(404, { type: "txt", content: [`Riktig! Dessverre kan du kun delta i denne konkurranse-mappa ${competitionDate.getDate()}. desember`] });
        }
    } else {
      res.send(404, {});
    }
})

app.post('/api/user/create', async (req,res) => {
  let email = req.body.email;
  let username = req.body.username;
  let createdUser = await db.addUser(email, username);
  res.cookie('id', createdUser._id, { expires: new Date(Date.now() + 900000), httpOnly: true });
  res.send(createdUser);
})

app.post('/api/user/verify', async (req,res) => {
  let email = req.body.email;
  let username = req.body.username;
  let createdUser = await db.addUser(email, username);
  res.cookie('id', createdUser._id, { expires: new Date(Date.now() + 900000), httpOnly: true });
  res.send(createdUser);
})


app.post('/api/thefiles', (req,res) => {
  let path = req.body.path;
  let fileName = req.body.fileName;
  let file = getFile(path, fileName);
  res.send(file);
})


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

const port = process.env.PORT || 5000;
app.listen(port);

let http = require("http");

setInterval(function() {
    http.get("http://kode24-signup.herokuapp.com/");
}, 300000) // every 5 minutes (300000)