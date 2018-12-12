const mongoose = require("mongoose");
const moment = require("moment");
mongoose.connect(
  "mongodb://" +
    process.env.DBUSER +
    ":" +
    process.env.DBPASSWORD +
    "@ds123753.mlab.com:23753/kode24-julebase"
);

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, unique: true, lowercase: true},
  username: { type: String, unique: true, lowercase: true },
  aggregatedAnswerCount: { type: Number, default: 0 },
  answersInFolders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }]
});

const FolderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullpath: { type: String },
  parent: { type: String },
  name: { type: String },
  availableFrom: { type: Date, default: Date.now },
  passphrase: { type: String },
  points: { type: Number, default: 1 },
	answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	global: { type: Boolean },
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
const User = mongoose.model("User", UserSchema);

async function addUser(email, username) {
  try {
    let newUser = new User({
			"_id": new mongoose.mongo.ObjectId(),
      email: email.toLowerCase(),
			username: username.toLowerCase(),
			aggregatedAnswerCount: 0,
			answersInFolders: []
    });

    await newUser.save();
    return newUser;
  } catch (error) {
		console.log('dataerror',error);
    return false;
  }
}

async function findUserByEmail(email) {
	try {
		return await User.findOne({email: email});
	} catch(error) {
		return false;
	}
}

async function findUserByUsername(username) {
	try {
		return await User.findOne({username: username});
	} catch(error) {
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

async function getFileInpath(fullpath, fileName) {
  try {
    return await Folder.findOne(
      { fullpath: fullpath, "files.name": fileName.toLowerCase() },
      "files files.path files.name files.type files.size files.content availableFrom fullpath name parent"
    )
      .populate("answers", "username -_id")
      .exec();
  } catch (error) {
    return false;
  }
}

async function getSubFoldersOfPath(fullpath) {
	var today = moment().startOf('day')
	var tomorrow = moment(today).endOf('day')


  try {
    return await Folder.find(
			{ 
				parent: fullpath,
				availableFrom: {
					$lt: tomorrow.toDate()
				}
			},
      "files files.path files.name files.type files.size files.content availableFrom fullpath name parent"
    )
      .sort({"name": 1})
      .populate("answers", "username -_id")
      .exec();
  } catch (error) {
    return false;
  }
}

async function getGlobalSubFoldersOfPath(fullpath) {
  try {
    return await Folder.find(
			{ 
				parent: fullpath,
				global: true
			},
      "files files.path files.name files.type files.size files.content availableFrom fullpath name parent"
    )
      .populate("answers", "username -_id")
      .exec();
  } catch (error) {
    return false;
  }
}

async function getFolderFromPath(fullpath) {
	var today = moment().startOf('day')
	var tomorrow = moment(today).endOf('day')

  try {
    return await Folder.findOne(
      { 
				fullpath: fullpath
			},
      "files files.path files.name files.type files.size files.content availableFrom fullpath name parent passphrase global points"
    )
      .populate("answers", "username -_id")
      .exec();
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
  getFolderFromPath: getFolderFromPath,
  getSubFoldersOfPath: getSubFoldersOfPath,
	getFileInpath: getFileInpath,
	getGlobalSubFoldersOfPath: getGlobalSubFoldersOfPath
};
