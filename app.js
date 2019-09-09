const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

var os = require("os");
var ifaces = os.networkInterfaces();
let ipAdress;

Object.keys(ifaces).forEach(function(ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function(iface) {
    if ("IPv4" !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ":" + alias, iface.address);
      ipAdress = iface.address;
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      ipAdress = iface.address;
    }
    ++alias;
  });
});
// console.log("LOCALNETWORK", ipAddress);

const Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
const LED = new Gpio(1, "out"); //use GPIO pin 4, and specify that it is output
LED.unexport(); // Unexport GPIO to free resources
blinkLED();

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

console.log(ipAdress);
// app.listen(3001, ipAdress, () => {
//   console.log("running on: 3001", ipAdress);
// });
module.exports = app;
