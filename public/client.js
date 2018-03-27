var COLOUR =  '#505050';  // This is the drawing color
var radius = 3;           // Constant radio for the line
var socket = io();        // websocket to the server
var previousPosition=[0,0]; // previous position to draw a line from
var ctx = Sketch.create(); //Creating the drawing context
var firstMessage=true;    // What the first message, to start on the first value

    ctx.container = document.getElementById( 'container' ); //reference drawing canvas
    ctx.autoclear= false; // making sure it stays
    ctx.retina='auto';
    ctx.setup = function() { console.log( 'setup' );} // Setup all variables
    ctx.keydown= function() { if ( ctx.keys.C ) ctx.clear();} // handeling keydowns

    socket.on('reset', function() { // on a 'reset' message clean and reste firstMessage
      firstMessage=true;
      ctx.clear();
    });

    socket.on('new-pos', function(newPosition) { // handling new sensor values

      let width = ctx.width;
      let height = ctx.height;

      newPosition[0] = map(newPosition[0], 0, 1023, 0, width);
      newPosition[1] = map(newPosition[1], 0, 1023, 0, height);

      if(firstMessage){ // if its the first message store that value as previous
        firstMessage=false;
        previousPosition=newPosition;
      }else{ // any other message we use to draw.
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = ctx.strokeStyle = COLOUR;
        ctx.lineWidth = radius;
        ctx.beginPath();  //begin a adrawing
        ctx.moveTo( previousPosition[0], previousPosition[1] ); // from
        ctx.lineTo( newPosition[0],  newPosition[1]); // to
        ctx.stroke(); // and only draw a stroke
        previousPosition=newPosition; // update to the new position.
       }
    });
    
    socket.on('thickness', function(value) {
      radius = value;
    });

    socket.on('color', function(value) { 
      switch (value) {
        case '0': 
          COLOUR ="#f42424";
          break;
        case '1': 
          COLOUR = "#f48c42";
          break;
        case '2': 
          COLOUR = "#f2d21f";
          break;
        case '3': 
          COLOUR = "#8cf226";
          break;
        case '4': 
          COLOUR = "#01ad15";
          break;
        case '5': 
          COLOUR = "#28f4ff";
          break;
        case '6': 
          COLOUR = "#2800f0";
          break;
        case '7': 
          COLOUR = "#8f70ff";
          break;
        case '8': 
          COLOUR = "#ff07f6";
          break;
        case '9': 
          COLOUR = "#505050";
          break;
      }

      console.log(COLOUR);

      ctx.fillStyle = ctx.strokeStyle = COLOUR;
    });