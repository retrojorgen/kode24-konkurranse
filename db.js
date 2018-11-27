const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.DBUSER + ':' + process.env.DBPASSWORD + '@ds123753.mlab.com:23753/kode24-julebase')


const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, unique: true},
    username: { type: String, unique: true},
    aggregatedAnswerCount : {type: Number, default: 0},
    answersInFolders: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }
    ]
});

const FolderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullpath: { type: String},
    parent: { type: String},
    name: { type: String},
    availableFrom: { type: Date, default: Date.now },
    passphrase: { type: String},
    answers: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    files: [
        {
            "name" : { type: String},
            "type" : { type: String},
            "size" : { type: Number},
            "content" : [ 
                { type: String}
            ],
            "path": { type: String}
        }
    ]
});

const Folder = mongoose.model('Folder', FolderSchema);
const User = mongoose.model('User', UserSchema);


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
    return await Folder.findOne({fullpath: fullpath, "files.name": fileName.toLowerCase()}, "files files.path files.name files.type files.size files.content availableFrom fullpath name parent").populate('answers', 'username -_id').exec();
}

async function getSubFoldersOfPath (fullpath) {
    return await Folder.find({parent: fullpath}, "files files.path files.name files.type files.size files.content availableFrom fullpath name parent").populate('answers', 'username -_id').exec();
}

async function getFolderFromPath (fullpath) {
    console.log('running', fullpath);
    return await Folder.findOne({fullpath: fullpath}, "files files.path files.name files.type files.size files.content availableFrom fullpath name parent").populate('answers', 'username -_id').exec();
}

async function AddAnswer (fullpath, user) {

    let folder = await getFolderFromPath(fullpath);
    let today = new Date();

    
    if(folder.answersindexOf()) {
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
    getFolderFromPath: getFolderFromPath,
    getSubFoldersOfPath: getSubFoldersOfPath,
    getFileInpath: getFileInpath
}  