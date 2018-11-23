
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
        {type: "txt", content: [
          "!! TOMS DATAMASKIN, HJÆLPEDOKUMENT",
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
          "* DIR - LIST UT INHOLD I MAPPA DU ER I",
          "* CD %DIRECTORY% - BYTT TIL EI MAPPE INNI MAPPA",
          "* CD.. - FLØTT OPP EI MAPPE",
          "* PRINT %FILE% - SKRIV UT EI AV FILANE",
          "* HELP - FÅ HJÆLP"
      ]
    })
  })

const isLoggedIn = async function (req, res, next) {
  if(req.cookies.id) {
    var user = await db.findUserById(req.cookies.id);
    if(user) {
      req.user = user;
      next();
    } else {
      res.send("401", "Invalid user");  
    }
  } else {
    res.send("401", "user not logged in");
  }
}

app.post('/api/filesystem/', isLoggedIn, async (req, res) => {
  let pathRequest = req.body.path;
  let path = db.getFolderFromPath(pathRequest);
  if(!path) {
    res.send(404, {type: "error", content: ["Fant ikke mappa"]});
  } else {
    let pathFolders = await db.getSubFoldersOfPath(pathRequest);
    let pathFiles = await db.getFilesInPath(pathRequest);
    res.send({
      path: path,
      folders: pathFolders,
      files: pathFiles
    })
  }
})


app.post('/api/files/', isLoggedIn, async (req,res) => {
  let path = req.body.path;
  let fileName = req.body.fileName;
  let file = await db.getFileInpath(path, fileName);
  if(file) {
    res.send(file);
  } else {
    res.send(404, {});
  }
  
})

app.get('/api/verify', isLoggedIn, async (req, res) => {
  res.send(req.user);
})

app.post('/api/code', isLoggedIn, async (req,res) => {
  let path = req.body.path;
  let code = req.body.code;

  let folder = await db.getFolderFromPath(path);

  if(!folder.passphrase) {
    res.send(404, {type: "error", content: "error"});
  } else {
    if(!folder.passphrase.toLowerCase() === code.toLowerCase()) {
      res.send(404, {type: "error", content: "Feil kode dessverre"});
    } else {
      let answer = await db.AddAnswer(path, req.user.email);

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
          res.send(404, { type: "txt", content: [`Riktig! Konkurransen for denne dagen, ${competitionDate.getDate()}. desember, er dessverre over. Sjekk dagens konk i mappen `] });
        }
    }
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




app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

const port = process.env.PORT || 5000;
app.listen(port);

let http = require("http");

setInterval(function() {
    http.get("http://kode24-signup.herokuapp.com/");
}, 300000) // every 5 minutes (300000)