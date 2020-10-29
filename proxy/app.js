var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var passport = require('passport');
var headerStrategy = require('passport-http-header-strategy').Strategy;

var indexRouter = require("./routes/index");

var app = express();

app.use(passport.initialize());
passport.use(
  new headerStrategy(
    { header: "secret", passReqToCallback: false },
    (token, done) => {
      // TODO: Currently there is no user management so the returned user is unnecessary
      if (
        !process.env.FirebaseStudioSecret ||
        token === process.env.FirebaseStudioSecret
      )
        return done(null, { authorized: true });
      return done(null, null);
    }
  )
);

if (!process.env.FirebaseStudioSecret) console.warn("Your proxy is currently open. Set a secret with the environment variable `FirebaseStudioSecret`");

// view engine setup
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/", passport.authenticate('header',  {session: false }), indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
