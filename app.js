var express  = require("express");
var app  = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var autoIncrement = require("mongoose-auto-increment");
var User = require("./models/user");
var Bus = require("./models/bus");
var Ticket = require("./models/ticket");


var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/orange_bus");
var db = mongoose.connection;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(require("express-session")({
    secret: "12345-67890-09876-54321",
    resave: false,
    saveUninitialized: false
}));

autoIncrement.initialize(db);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);

app.listen(3000,()=>{
   console.log("The Server has started!!");
});
