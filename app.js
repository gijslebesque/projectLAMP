const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// const os = require("os");
// const ipAddress = os.networkInterfaces();

// console.log("LOCALNETWORK", ipAddress);

const Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
const LED = new Gpio(1, "out"); //use GPIO pin 4, and specify that it is output

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

const blinkLED = () => {
  //function to start blinking
  if (LED.readSync() === 0) {
    //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
};

app.post("/postMessage", (req, res) => {
  debugger;
  blinkLED();
  res.json({ ok: "ok" });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, "192.168.2.146");
// module.exports = app;
