const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.DBUSER + ':' + process.env.DBPASSWORD + '@ds123753.mlab.com:23753/kode24-julebase')


const SubmissionSchema = new mongoose.Schema({
    fullpath: { type: String},
    email: { type: String },
    username: { type: String},
    submitted: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    email: { type: String},
    username: { type: String}
});

const FolderSchema = new mongoose.Schema({
    fullpath: { type: String},
    parent: { type: String},
    name: { type: String},
    availableFrom: { type: Date, default: Date.now },
    passphrase: { type: String}
});

const FileSchema = new mongoose.Schema({
    fullpath: { type: String},
    name: { type: String},
    type: { type: String},
    size: { type: Number},
    content: [] 
});



const Submission = mongoose.model('Submissions', SubmissionSchema);
const Folder = mongoose.model('Folders', FolderSchema);
const User = mongoose.model('Users', UserSchema);
const File = mongoose.model('Files', FileSchema);


async function addUser (email, username) {
    try {
        let newUser = new User({
            email: email,
            username: username
        });

        await newUser.save();
        return newUser;
    } catch (error) {
        return false;
    } 
}

async function findUserById (userId) {
    try {
        return User.findById(userId);
    } catch (error) {
        return false;
    }
}

async function getFileInpath (fullpath, fileName) {
    return await File.findOne({fullpath: fullpath, name: fileName.toLowerCase()});
}

async function getFilesInPath (fullpath) {
    return await File.find({fullpath: fullpath});
}

async function getSubFoldersOfPath (fullpath) {
    return await Folder.find({parent: fullpath});
}

async function getSubmission (email, fullpath) {
    return await Submission.findOne({email: email, fullpath: fullpath});
}

async function getFolderFromPath (fullpath) {
    return await Folder.findOne({fullpath: fullpath});
}

async function AddAnswer (fullpath, email, username) {

    let folder = await getFolderFromPath(fullpath);
    let today = new Date();

    let newSubmission = new Submission({
        fullpath: fullpath,
        email: email,
        username: username
    });
        
    if(await getSubmission(email, fullpath)) {
        return 2;
    } else {
        await newSubmission.save();
        if(folder.availableFrom.getDate() !== today.getDate()) {   
            return 3;
        } else {
            return 1;
        }
    }
}


module.exports = {
    AddAnswer: AddAnswer,
    addUser: addUser,
    findUserById: findUserById,
    getFilesInPath: getFilesInPath,
    getFolderFromPath: getFolderFromPath,
    getSubFoldersOfPath: getSubFoldersOfPath,
    getFileInpath: getFileInpath
}  