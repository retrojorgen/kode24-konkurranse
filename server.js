
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const moment = require("moment")
const files = require('./files.js')
const db = require('./db.js');
const app = express()

console.log(new Date());


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
  console.log(new Date());
  if(req.cookies.id) {
    var user = await db.findUserById(req.cookies.id);
    if(user) {
      req.user = user;
      next();
    } else {
      res.send("401", "Invalid user");  
    }
  } else {
    res.send("401", "\"user not logged in\"");
  }
}

app.post('/api/filesystem/', isLoggedIn, async (req, res) => {
  let pathRequest = req.body.path;
  let path = await db.getFolderFromPath(pathRequest);
  console.log('hest');

  if(!path) {
    let hasAccess = false;
    if(path.global)
      hasAccess = true;  
    if(path.availableFrom && moment(path.availableFrom).isSame(new Date(), 'day'))
      hasAccess = true

    res.send({type: "error", content: ["Fant ikke mappa"]});

  } else {

    let pathFolders = await db.getSubFoldersOfPath(pathRequest);
    let globalFolders = await db.getGlobalSubFoldersOfPath(pathRequest);
       
    res.send({
      parent: path.parent,
      name: path.name,
      fullPath: path.name,
      passphrase: path.passphrase ? true: false,
      answers: path.answers,
      files: path.files,
      folders: pathFolders.concat(globalFolders)
    });
  }
})


app.post('/api/files/', isLoggedIn, async (req,res) => {
  let path = req.body.path;
  let fileName = req.body.fileName.toLowerCase();
  let filePath = await db.getFileInpath(path, fileName);
  console.log('filær', filePath, fileName, path);
  if(!filePath) {
    res.send(404, {type: "error", content: "Fant ikke fila di."});
  } else {
    let file = filePath.files.find((file) => file.name.toLowerCase() === fileName);
    if(file) {
      res.send(file);
    } else {
      res.send(404, {type: "error", content: "Fant ikke fila di."});
    }
  }
  

  
})

app.post('/api/verify/recover', async (req, res) => {
  
  var email = req.body.email;
  let foundUser = await db.findUserByEmail(email);
  console.log('fant bruker', foundUser);
  if(foundUser) {
    res.cookie('id', foundUser._id, { expires: new Date(Date.now() + 9000000000), httpOnly: true });
    res.send({
      verified: true,
      username: foundUser.username, 
      email: foundUser.email,
      points: foundUser.aggregatedAnswerCount || 0
    });
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
  let today = new Date();

  let folder = await db.getFolderFromPath(path);
  
  // finnes mappa
  if(!folder) {
    res.send({
      type: "error", content: "Fant ikke mappa di"
    });
  } else {
    // har mappa passord
    if(!folder.passphrase) {
      res.send({type: "error", content: "denne mappa har ikke noe passordgreiær"});
    } else {
      // har brukeren allerede svart
      if(req.user.answersInFolders.indexOf(folder._id) > -1) {
        res.send({type: "error", content: "Jøssameien. Du har allerede svart jo!"});
      } else {
        // er passordet riktig?
        if(folder.passphrase.toLowerCase() !== code.toLowerCase()) {
          res.send({type: "error", content: "Nå haru koda feil kode trujæ."});
        } else {
  
          // vi har kommet gjennom og skal legge inn registrering av riktig passord
          let answer = await db.AddAnswer(path, req.user, folder, today);
          res.send({
            type: "txt", content: ["Takkær og bukkær! Det var riktig passord vøtt.", "Då erru med i dågens trekning!"]
          });
        } 
      }
    }      
  }   
})

app.post('/api/user/create', async (req,res) => {
  let email = req.body.email;
  let username = req.body.username;
  let createdUser = await db.addUser(email, username);
  console.log(email, username, createdUser, 'hest');
  res.cookie('id', createdUser._id, { expires: new Date(Date.now() + 9000000000), httpOnly: true });
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