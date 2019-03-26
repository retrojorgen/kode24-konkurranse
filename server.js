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
    type: "ascii",
    content: `
      "PORSGRUNN RÅDHUS - DOKUMENTSERVER",
      "****************************",
      "* DIR - LIST UT FILANE DINE",
      "* PRINT %FILE% - SKRIV UT EI AV FILANE",
      "* LOGOUT - BYTT BRUKÆR",
      "* HELP - FÅ HJÆLP"
    `
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
  if (req.cookies.filesystemid) {
    var user = await db.findFileSystemUserById(req.cookies.filesystemid);
    if (user) {
      req.fileSystemUser = user;
      next();
    } else {
      res.send("401", "Invalid user");
    }
  } else {
    res.send("401", '"user not logged in"');
  }
};

app.post("/api/command/", isLoggedIn, async (req, res) => {
  // attempt to store commands from users anonymously
});

app.post("/api/login/filesystemuser", isLoggedIn, async (req, res) => {
  var username = req.body.username.toLowerCase();
  var password = req.body.password.toLowerCase();
  let foundUser = await db.findFileSystemUserByUsernameAndPassword(
    username,
    password
  );
  console.log("fant bruker", foundUser, username, password);
  if (foundUser) {
    res.cookie("filesystemid", foundUser._id, {
      expires: new Date(Date.now() + 9000000000),
      httpOnly: true
    });
    res.send({
      user: foundUser,
      verified: true
    });
  } else {
    res.send(404, {});
  }
});

app.post(
  "/api/files/",
  isLoggedIn,
  isLoggedInAsFileSystemUser,
  async (req, res) => {
    let userId = req.user._id;
    let fileSystemUserId = req.fileSystemUser._id;
    let foundFiles = await db.findFilesByFileSystemUserId(fileSystemUserId);
    if (foundFiles) {
      res.send({
        files: foundFiles.files,
        hasAnswered: foundFiles.answers.indexOf(userId) > -1 ? true : false
      });
    } else {
      res.send(404, {});
    }
  }
);

app.get(
  "/api/troll/",
  isLoggedIn,
  isLoggedInAsFileSystemUser,
  async (req, res) => {
    let userId = req.user._id;
    let fileSystemUserId = req.fileSystemUser._id;
    let isTrolled = await db.trollFiles(userId, fileSystemUserId);
    if (isTrolled) {
      res.send({});
    } else {
      res.send(404, {});
    }
  }
);

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
  res.send(req.user);
});

app.get(
  "/api/verify/filesystem",
  isLoggedInAsFileSystemUser,
  async (req, res) => {
    res.send(req.fileSystemUser);
  }
);

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
