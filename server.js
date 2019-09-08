var express = require("./node_modules/express");
var session = require("./node_modules/express-session");
var cookieParser = require('./node_modules/cookie-parser');
var bodyParser = require('./node_modules/body-parser');
var morgan = require('./node_modules/morgan');
var passport = require("./config/passport");
var cors = require('./node_modules/cors');
var path = require('path');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 8080;
app.use(cors()); // Add routes, both API and view

// Requiring our models for syncing
var db = require("./models");

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Serve up static assets
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// We need to use sessions to keep track of our user's login status
app.use(session({
    secret: "wesurvivedbootcamp",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Routes
// require("./routes/api/userRoute")(app);
// require("./routes/api/XRoute")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}
else {
  app.use(express.static(path.join(__dirname, '/client/public')));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
  });
}

// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({
  force: false
}).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});