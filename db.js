const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.DBUSER + ':' + process.env.DBPASSWORD + '@ds123753.mlab.com:23753/kode24-julebase')


const CompetitionsSchema = new mongoose.Schema({
    type: { type: String},
    name: { type: String},
    namespace: { type: String},
    participants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId },
            submitted: { type: Date, default: Date.now }
        }
    ]
});

const UserSchema = new mongoose.Schema({
    email: { type: String},
    username: { type: String}
});

const Competitions = mongoose.model('Competitions', CompetitionsSchema);
const User = mongoose.model('Users', UserSchema);

async function findAllCompetitions () {
    const competitions = await Competitions.find({});
    return competitions;
}

async function findCompetition (namespace) {

    try {
        const competitions = await Competitions.findOne({namespace: namespace});
        return competitions;
    } catch (error) {
        return error;
    }
    
}

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
        const user = User.findById(userId);
        return user;
    } catch (error) {
        return false;
    }
}

async function AddAnswer (namespace, participantId, canparticipate) {

    const competition = await findCompetition (namespace);

    console.log(competition);

    if(competition) {
        
        let participant = competition.participants.find((participant) => participant.email === participant.email);
        if(!canparticipate) {
            return 3;
        } else {
            if(!participant) {
                competition.participants.push(
                    {
                        userId: participantId,
                        submitted: new Date()
                    }
                )
                await competition.save();
                return 2; 
            } else {
                return 1;
            }
        }
        
    } else {
        return false;
    }




   const newCompetition = new Competitions({
    type: "bla",
    name: "bla2",
    namespace: "hest",
    participants: []
   })
   const saveCompetition = await newCompetition.save((status) => console.log(status));
   return saveCompetition;
}


module.exports = {
    AddAnswer: AddAnswer,
    addUser: addUser
}  