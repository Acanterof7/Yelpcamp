// env variables
const PORT = process.env.PORT || 8080,
    IP = process.env.IP || "localhost";


//imports
const express = require("express"),
    // @ts-ignore
    app = express(),
    http = require('http'),
    https = require('https'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

// @ts-ignore
//seedsDB = require("./seeds");
//seedsDB();

// Routes
const commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    loginRoutes = require("./routes/login"),
    indexRoutes = require("./routes/index");



//passport config
app.use(require("express-session")({
    secret: "Kaido is a Dragon",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// @ts-ignore
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// sapp configuration
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(flash());

// mongoose connection
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://127.0.0.1:27017/Yelpcamp", { useNewUrlParser: true });

// adding user info to all pages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// adding routes
app.use("/", indexRoutes);
app.use("/", loginRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// run app
// @ts-ignore
https.createServer(app).listen(PORT, IP, () => {
    console.log("connected https")
});

