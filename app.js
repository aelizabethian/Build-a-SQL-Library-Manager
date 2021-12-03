var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let sequelize = require("./models").sequelize;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bookRouter = require("./routes/books");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/books", bookRouter);

//Synching data in bin file/authentication  below
try {
  sequelize.authenticate();
  console.log("Connection to the database successful!");
} catch (error) {
  console.error("Unable to connect to the database ", error);
}

// catch 404 and forward to error handler (created by express generator)
app.use(function (req, res, next) {
  next(createError(404));
});

//404 new errror handler

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  err.message = "I'm sorry but the page you are trying to access doesn't exist";
  console.log(err.status, err.message);
  next(err);
});

//global error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    res.status(err.status || 500).render("error", { err });
  }
  console.log("Global error", err.status);
});

module.exports = app;
