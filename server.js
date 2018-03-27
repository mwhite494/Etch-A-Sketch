
var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var serialPort = require('serialport'); // serial library
var readLine = serialPort.parsers.Readline; // read serial data as lines
var x = 0; 
var y = 0;

//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory


// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- SERIAL COMMUNICATION --------------------------------//
// start the serial port connection and read on newlines
const serial = new serialPort('/dev/tty.SLAB_USBtoUART', {
 baudRate:9600

});
const parser = new readLine({
  delimiter: '\r\n'
});

// Read data that is available on the serial port and send it to the websocket
serial.pipe(parser);
parser.on('data', function(data) { // on data from the arduino
  if(data=='rst'){  // if its the 'rst' string call reset
    io.emit('reset');
  }else{ // any other data we try to forward by spliting it
    switch (data.charAt(0)) {
      case 'c': //COLOR
        let color = data.substring(1, data.length);
        console.log(color); 
        io.emit('color', color);
        break;
      case 'x':
        x = data.substring(1, data.length);
        console.log(x);
        break;
      case 'y':
        y = data.substring(1, data.length);
        console.log(y);
        break;
      case 'd': //DELETE
        io.emit('reset');
        break;
      case 't': //THICKNESS
        let thickness = data.substring(1, data.length)
        io.emit('thickness', thickness);
        break;
      default:
        console.log('hi');
    }
    var transmitData = [x,y];
    io.emit('new-pos', transmitData);
  }
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a user connected');
  io.emit('reset'); // call reset to make sure the website is clean

// if you get the 'disconnect' message, say the user disconnected
  io.on('disconnect', function() {
    console.log('user disconnected');
  });
});
