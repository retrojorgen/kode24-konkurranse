let domain = ".kode24.no";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
  domain = "";
}

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const cors = require("cors");

const db = require("./db.js");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const handShakeCode = process.env.ADMINHASH;
let socketConnections = {};
let adminConnections = [];

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use("/admin", express.static(path.join(__dirname, "clientAdmin/build")));
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

const isAdmin = function(req, res, next) {
  if (req.cookies.kode24Admin && req.cookies.kode24Admin === handShakeCode) {
    next();
  } else {
    if (req.params.adminCode === handShakeCode) {
      next();
    } else {
      res.send("401", "Invalid user");
    }
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

  if (foundUser) {
    res.cookie("filesystemid", foundUser._id, {
      expires: new Date(Date.now() + 9000000000),
      httpOnly: true,
      domain: domain
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

app.get("/api/exposed/messages", async (req, res) => {
  let foundMessages = await db.getExposedMessages();
  if (foundMessages) {
    res.send(foundMessages);
  } else {
    res.send(404, {});
  }
});

app.post("/api/exposed/login", (req, res) => {
  if (
    req.body.username.toLowerCase() === process.env.EXPOSEDSECRET.toLowerCase()
  ) {
    res.send({
      username: process.env.EXPOSEDSECRET,
      message: process.env.EXPOSEDMESSAGE
    });
  } else {
    res.send(404, {});
  }
});

app.get(
  "/api/troll/",
  isLoggedIn,
  isLoggedInAsFileSystemUser,
  async (req, res) => {
    let userId = req.user._id;
    let fileSystemUserId = req.fileSystemUser._id;
    let isTrolled = await db.trollFiles(userId, fileSystemUserId, req.user);
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
      httpOnly: true,
      domain: domain
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
    httpOnly: true,
    domain: domain
  });
  res.send(createdUser);
});

app.get("/api/admin/events/:adminCode", isAdmin, async (req, res) => {
  let commandEvents = await db.getEventByType("typed command");
  commandEvents = commandEvents.filter(event => event.command !== "");
  let upEvents = await db.getEventByType("typed filesystem username password");
  let mysteryEvents = await db.getEventByType("typed mystery password");
  res.send({
    CommandEventsCount: commandEvents.length,
    UPEventsCount: upEvents.length,
    MysteryEventsCount: mysteryEvents.length,
    UPEventsNewest: upEvents.slice(0, 10),
    mysteryEventsNewest: mysteryEvents.slice(0, 10),
    CommandEventsNewest: commandEvents.slice(0, 10)
  });
});

app.get("/api/admin/answers/:adminCode", isAdmin, async (req, res) => {
  let answers = await db.getAnswersByFolder();
  let answersByKey = {};
  answers.forEach(folder => {
    answersByKey[folder.userId.username] = folder.answers.length;
  });
  res.send(answersByKey);
});

app.get("/api/admin/users/:adminCode", isAdmin, async (req, res) => {
  let users = await db.getUserCount();
  res.send({
    users: users.length
  });
});

function getConnectionLength() {
  return Object.keys(socketConnections).length;
}

io.on("connection", socket => {
  socketConnections[socket.id] = socket;

  socket.on("admin get user list", () => {
    pushToAdmins("admin user list", getConnectionLength());
  });

  socket.on("admin handshake", async handshake => {
    if (handshake === handShakeCode) {
      adminConnections.push(socket);
      const events = await db.getEvents();
      pushToAdmins("admin events", events);
      pushToAdmins("admin user list", getConnectionLength());
    }
  });

  socket.on("typed command", command => {
    if (command) {
      db.addEvents("typed command", command, {});
      pushToAdmins("admin typed command", command);
    }
  });

  socket.on("typed mystery password", command => {
    if (command) {
      db.addEvents("typed mystery password", command, {});
      pushToAdmins("admin typed mystery password", command);
    }
  });

  socket.on("typed filesystem username password", command => {
    db.addEvents("typed filesystem username password", "", command);
    pushToAdmins("admin typed filesystem username password", command);
  });
  socket.on("disconnect", () => {
    delete socketConnections[socket.id];
    pushToAdmins("admin user list", getConnectionLength());
  });
});

function pushToAdmins(command, data) {
  adminConnections.forEach(connection => {
    io.to(`${connection.id}`).emit(command, data);
  });
}

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname + "/clientAdmin/build/index.html"));
});

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/clientAdmin/build/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
http.listen(port);
