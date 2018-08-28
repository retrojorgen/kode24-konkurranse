if (process.env.NODE_ENV == 'dev') {
  require('dotenv').config(); 
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(process.env.MAILCHIMP_KODE24);

const app = express();





// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Put all API endpoints under '/api'
app.get('/api/test', (req, res) => {
  res.json({title: "kode24"});
});

app.post('/api/email', (req, res) => {


  const email = req.body.email;
  const name = req.body.name;
  const nameList = name.split(" ");
  const firstName = nameList[0];
  const lastName = nameList.length > 1 ? nameList.splice(1, nameList.length).join(" ") : "";

  mailchimp.post("/lists/" + process.env.MAILCHIMP_KODE24_LIST_ID + "/members/",
  {
    "email_address": email,
    "status": "subscribed",
    "merge_fields": {
        "FNAME": firstName,
        "LNAME": lastName
    }
  })
  .then(function(results) {
    res.json(results);
  })
  .catch(function (err) {
    res.json(err);
  })
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`listening on ${port}`);




var http = require("http");

setInterval(function() {
    http.get("http://kode24-signup.herokuapp.com/");
}, 300000); // every 5 minutes (300000)