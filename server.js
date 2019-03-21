if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const db = require("./db.js");
const app = express();

console.log(new Date());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// parse application/json
app.use(bodyParser.json());

app.get("/api/help", (req, res) => {
  res.json({
    type: "txt",
    content: [
      "PORSGRUNN RÅDHUS - DOKUMENTSERVER",
      "****************************",
      "* DIR - LIST UT FILANE DINE",
      "* PRINT %FILE% - SKRIV UT EI AV FILANE",
      "* LOGOUT - BYTT BRUKÆR",
      "* HELP - FÅ HJÆLP"
    ]
  });
});

const isLoggedIn = async function(req, res, next) {
  console.log(new Date());
  console.log(req.cookies.id);
  if (req.cookies.id) {
    var user = await db.findUserById(req.cookies.id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.send("401", "Invalid user");
    }
  } else {
    res.send("401", '"user not logged in"');
  }
};

const isLoggedInAsFileSystemUser = async function(req, res, next) {
  console.log(new Date());
  if (req.cookies.id) {
    var user = await db.findUserById(req.cookies.id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.send("401", "Invalid user");
    }
  } else {
    res.send("401", '"user not logged in"');
  }
};

app.post(
  "/api/userfiles",
  isLoggedIn,
  isLoggedInAsFileSystemUser,
  async (req, res) => {
    let userFolder = req.body.path;
    let path = await db.getFolderFromPath(pathRequest);

    if (!path) {
      res.send(404, { type: "error", content: "Fant ikke mappa" });
    } else {
      if (
        path.availableFrom &&
        moment()
          .startOf("day")
          .diff(path.availableFrom, "days") < 0
      ) {
        res.send(404, { type: "error", content: "Fant ikke mappa" });
      } else {
        let pathFolders = await db.getSubFoldersOfPath(pathRequest);
        let globalFolders = await db.getGlobalSubFoldersOfPath(pathRequest);

        res.send({
          parent: path.parent,
          name: path.name,
          fullPath: path.name,
          passphrase: path.passphrase ? true : false,
          answers: path.answers,
          files: path.files,
          folders: pathFolders.concat(globalFolders)
        });
      }
    }
  }
);

app.post("/api/command/", isLoggedIn, async (req, res) => {
  // attempt to store commands from users anonymously
});

app.post("/api/verify/recover", async (req, res) => {
  var email = req.body.email.toLowerCase();
  let foundUser = await db.findUserByEmail(email);
  if (foundUser) {
    res.cookie("id", foundUser._id, {
      expires: new Date(Date.now() + 9000000000),
      httpOnly: true
    });
    res.send({
      verified: true,
      username: foundUser.username,
      email: foundUser.email,
      points: foundUser.aggregatedAnswerCount || 0
    });
  } else {
    res.send(404, {});
  }
});

app.post("/api/verify/email", async (req, res) => {
  var email = req.body.email.toLowerCase();
  let foundUser = await db.findUserByEmail(email);
  if (foundUser) {
    res.send({
      user: foundUser,
      verified: true
    });
  } else {
    res.send(404, {});
  }
});

app.post("/api/verify/username", async (req, res) => {
  var username = req.body.username.toLowerCase();
  let foundUser = await db.findUserByUsername(username);
  if (foundUser) {
    res.send({
      username: username
    });
  } else {
    res.send(404, {});
  }
});

app.get("/api/verify", isLoggedIn, async (req, res) => {
  console.log("hest");
  res.send(req.user);
});

app.post("/api/code", isLoggedIn, async (req, res) => {
  let path = req.body.path;
  let code = req.body.code;
  let today = new Date();

  let folder = await db.getFolderFromPath(path);

  // finnes mappa
  if (!folder) {
    res.send({
      type: "error",
      content: "Fant ikke mappa di"
    });
  } else {
    // har mappa passord
    if (!folder.passphrase) {
      res.send({
        type: "error",
        content: "denne mappa har ikke noe passordgreiær"
      });
    } else {
      // har brukeren allerede svart
      if (req.user.answersInFolders.indexOf(folder._id) > -1) {
        res.send({
          type: "error",
          content: "Jøssameien. Du har allerede svart jo!"
        });
      } else {
        // er passordet riktig?
        if (folder.passphrase.toLowerCase() !== code.toLowerCase()) {
          res.send({ type: "error", content: "Nå haru koda feil kode trujæ." });
        } else {
          if (
            folder.availableFrom &&
            moment(folder.availableFrom).isSame(new Date(), "day")
          ) {
            // vi har kommet gjennom og skal legge inn registrering av riktig passord
            let answer = await db.AddAnswer(path, req.user, folder, today);
            res.send({
              type: "txt",
              content: [
                "** Passord korrekt: Server autorisert. **",
                `(du er med i dagens trekning, ${today.getDate()}. desember)`
              ]
            });
          } else {
            res.send({
              type: "txt",
              content: [
                "** Passord korrekt: Server er allerede autorisert. **",
                `Trekningen for denne dagen er over. Gå til dagens konkurransemappe, ${today.getDate()}. desember`,
                `** OBS! Du får kun poeng for å svare på dagens konkurranse.`
              ]
            });
          }
        }
      }
    }
  }
});

app.post("/api/user/create", async (req, res) => {
  let email = req.body.email.toLowerCase();
  let username = req.body.username.toLowerCase();
  let createdUser = await db.addUser(email, username);
  res.cookie("id", createdUser._id, {
    expires: new Date(Date.now() + 9000000000),
    httpOnly: true
  });
  res.send(createdUser);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

let http = require("http");

setInterval(function() {
  http.get("http://kode24-signup.herokuapp.com/");
}, 300000); // every 5 minutes (300000)
