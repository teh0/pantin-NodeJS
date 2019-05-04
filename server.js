var express = require('express');
var socket = require('socket.io');
var five = require('johnny-five');

var app = express();
app.use(express.static('app'));
var server = app.listen(4000, function () {
  console.log('Server cezmeo started !');
});
// INIT ARDUINO MOTOR SYSTEM
var board = new five.Board({
  repl: false
});

var io = socket(server);
board.on('ready', function () {
  var speed, commands, motors;
  var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1;
  var motor = new five.Motor(configs.M1);
  commands = null;
  var speed_fwd = 180;
  var speed_rvs = 150;

  io.on('connection', function (socket) {
    console.log('client connected');
    // console.log(configs);
    socket.on('fwd', function () {
      motor.forward(speed_fwd);
      console.log('forward');
    });
    socket.on('rvs', function () {
      motor.reverse(speed_rvs);
      console.log('reverse');
    });
    socket.on('stop', function () {
      motor.stop();
      console.log('stop');
    });
  });
});