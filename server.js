/* server.js - user & resource authentication */
// Modular version, with express routes imported separately.

'use strict';
const log = console.log
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
mongoose.set('bufferCommands', false);  // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.
mongoose.set('useFindAndModify', false); // for some deprecation issues

// /*** handlebars: server-side templating engine ***/
// const hbs = require('hbs')
// // Set express property 'view engine' to be 'hbs'
// app.set('view engine', 'hbs')
// // setting up partials directory
// hbs.registerPartials(path.join(__dirname, '/views/partials'))
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

/*** Session handling **************************************/
// express-session for managing user sessions
const session = require('express-session')

/// Middleware for creating sessions and session cookies.
// A session is created on every request, but whether or not it is saved depends on the option flags provided.
app.use(session({
    secret: 'our hardcoded secret', // later we will define the session secret as an environment variable for production. for now, we'll just hardcode it.
    cookie: { // the session cookie sent, containing the session id.
        expires: 300000, // 1 minute expiry
        httpOnly: true // important: saves it in only browser's memory - not accessible by javascript (so it can't be stolen/changed by scripts!).
    },

    // Session saving options
    saveUninitialized: false, // don't save the initial session if the session object is unmodified (for example, we didn't log in).
    resave: false, // don't resave an session that hasn't been modified.
}));



/** Static directories **/
// static js directory
app.use("/js", express.static(path.join(__dirname, '/public/js')))
// static image directory
app.use("/img", express.static(path.join(__dirname, '/public/img')))




/** Import the various routes **/
// User and login routes
app.use(require('./routes/listing'))
app.use(require('./routes/users'))
app.use(require('./routes/auction'))
app.use(require('./routes/inbox'))
app.use(require('./routes/filter'))

app.use(express.static(__dirname + "/client/build"));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
});


/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 