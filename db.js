const mongoose = require("mongoose");
const moment = require("moment");

mongoose.connect(
  "mongodb://" +
    process.env.DBUSER +
    ":" +
    process.env.DBPASSWORD +
    "@" +
    process.env.DBURL +
    "/" +
    process.env.DBNAME
);

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  aggregatedAnswerCount: { type: Number, default: 0 },
  answersInFolders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FileSystemUser" }
  ]
});

const ExposedMessagesSchema = new mongoose.Schema({
  title: { type: String, unique: true, lowercase: true },
  message: [],
  scheduled: { type: Date, default: Date.now }
});

const EventsSchema = new mongoose.Schema({
  type: { type: String },
  command: { type: String },
  added: { type: Date, default: Date.now },
  data: {}
});

const FileSystemUserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, unique: true, lowercase: true },
  password: { type: String }
});

const FolderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "FileSystemUser" },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  files: [
    {
      name: { type: String },
      type: { type: String },
      size: { type: Number },
      content: [{ type: String }],
      path: { type: String }
    }
  ]
});

const Folder = mongoose.model("Folder", FolderSchema);
const ExposedMessage = mongoose.model("exposedMessages", ExposedMessagesSchema);
const User = mongoose.model("User", UserSchema);
const FileSystemUser = mongoose.model("FileSystemUser", FileSystemUserSchema);
const Event = mongoose.model("Events", EventsSchema);

async function addUser(email, username) {
  try {
    let newUser = new User({
      _id: new mongoose.mongo.ObjectId(),
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      aggregatedAnswerCount: 0,
      answersInFolders: []
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    return false;
  }
}

async function getExposedMessages() {
  var today = moment().startOf("day");
  var tomorrow = moment(today).endOf("day");

  try {
    let messages = await ExposedMessage.find({
      scheduled: { $lt: tomorrow.toDate() }
    });
    return messages;
  } catch (error) {
    return false;
  }
}

async function trollFiles(userId, FileSystemUserId, user) {
  try {
    if (
      !user.answersInFolders ||
      user.answersInFolders.indexOf(FileSystemUserId) <= -1
    ) {
      if (!user.answersInFolders) user.answersInFolders = [FileSystemUserId];
      else user.answersInFolders.push(FileSystemUserId);
      user.aggregatedAnswerCount = user.aggregatedAnswerCount + 1;
      await user.save();
    }
    return await Folder.updateOne(
      { userId: FileSystemUserId },
      { $push: { answers: userId } }
    );
  } catch (error) {
    return false;
  }
}

async function addEvents(eventType, command, data) {
  try {
    let newEvent = new Event({
      type: eventType,
      command: command,
      added: new Date(),
      data: data
    });
    await newEvent.save();
    return true;
  } catch (error) {
    return false;
  }
}

async function getEventByType(eventType) {
  try {
    return await Event.find({ type: eventType }).sort({ added: -1 });
  } catch (error) {
    return false;
  }
}

async function getAnswersByFolder() {
  try {
    return await Folder.find({})
      .sort({ added: -1 })
      .populate("userId");
  } catch (error) {
    return false;
  }
}

async function getUserCount() {
  try {
    return await User.find({});
  } catch (error) {
    return false;
  }
}

async function getEvents() {
  try {
    return await Event.find({});
  } catch (error) {
    return false;
  }
}

async function findFileSystemUserByUsernameAndPassword(username, password) {
  try {
    return await FileSystemUser.findOne({
      username: username,
      password: password
    });
  } catch (error) {
    return false;
  }
}

async function findUserByEmail(email) {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    return false;
  }
}

async function findUserByUsername(username) {
  try {
    return await User.findOne({ username: username });
  } catch (error) {
    return false;
  }
}

async function findUserById(userId) {
  try {
    return User.findById(userId);
  } catch (error) {
    return false;
  }
}

async function findFileSystemUserById(userId) {
  try {
    return FileSystemUser.findById(userId);
  } catch (error) {
    return false;
  }
}

async function findFilesByFileSystemUserId(userId) {
  try {
    return Folder.findOne({ userId: userId });
  } catch (error) {
    return false;
  }
}

async function AddAnswer(fullpath, user, folder, today) {
  let points = folder.points || 1;
  user.answersInFolders.push(folder._id);
  user.aggregatedAnswerCount += points;
  await user.save();

  folder.answers.push(user._id);
  await folder.save();

  return true;
}

module.exports = {
  AddAnswer: AddAnswer,
  addUser: addUser,
  findUserByEmail: findUserByEmail,
  findUserByUsername: findUserByUsername,
  findUserById: findUserById,
  findFileSystemUserByUsernameAndPassword: findFileSystemUserByUsernameAndPassword,
  findFileSystemUserById: findFileSystemUserById,
  findFilesByFileSystemUserId: findFilesByFileSystemUserId,
  trollFiles: trollFiles,
  addEvents: addEvents,
  getEvents: getEvents,
  getExposedMessages: getExposedMessages,
  getAnswersByFolder: getAnswersByFolder,
  getEventByType: getEventByType,
  getUserCount: getUserCount
};
