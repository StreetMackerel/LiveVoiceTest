

// import express and initilize server
var express = require('express') 
// const https = require('https');

var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)

var _buttonState = false;
var _title;
var _author;
var _trackID = 0;
var _CdPos = 0;
var _WRstate = 0;

app.use(express.static(__dirname + '/public'))
app.use(express.json());

//Mount route
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html')
})

//when a client connects
io.on('connection', function(client) {
 console.log('Client conneted')

    //sets all states for new connections
    io.emit('title', _title); 
    io.emit('author', _author);
    io.emit('buttonSwitch', _buttonState)
    io.emit('next', _trackID)
    io.emit('killWR', _WRstate);

    io.clients(function(error, clients) {
        if(error) throw error;

        io.emit('clientList', clients)
    })

    //http listener triggered function
    client.on('httpTest1', function(){
        http.get('http://localhost:8050/test', (res) => {
            console.log('response!', res.statusMessage)
        
            io.emit('httpBack', res.statusMessage);
        })
	});

    client.on('httpTest2', function(){
        http.get('http://localhost:8050/test2', (res) => {
            console.log('response!', res.statusMessage)
        
            io.emit('httpBack', res.statusMessage);
        })
	});

    //web request triggered function
    app.post('/', function(request, response){
        console.log(request.body);      // your JSON
        response.send(request.body);    // echo the result back
        io.emit('httpBack', request.body.data);
    });

    app.post('/button', function(request, response){
        response.send(request.body);
        _buttonState=!_buttonState
        console.log("button is"+_buttonState);
        io.emit('buttonSwitch', _buttonState);
    });

    app.post('/title', function(request, response){
        _title = request.body.data;
        response.send(request.body);
        io.emit('title', _title);
    });

    app.post('/author', function(request, response){
        _author = request.body.data;
        response.send(request.body);
        io.emit('author', _author);
    });

    app.post('/next', function(request, response){
        _trackID = request.body.data;
        response.send(request.body);
        io.emit('next', _trackID);
    });

    app.post('/effect', function(request, response){
        response.send(request.body);
        io.emit('effect', request.body);
    });

    app.post('/vibrate', function(request, response){
        response.send(request.body);
        io.emit('vibrate', 500);
    });

    app.post('/startCountdown', function(request, response){
        response.send(request.body);
        startTimer(15);
    });
})

//start web server
server.listen(3000, function() {
    console.log('Server starting on port *:3000')
})

function startTimer(duration) {
    var timer = duration, minutes, seconds;

    var repeat = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        _CdPos = minutes + ":" + seconds;

        io.emit('setCountdown', _CdPos);

        if (--timer < 0) {
            timer = 0;
            io.emit("endCountdown", _CdPos);
            _WRstate = 1;
            clearInterval(repeat);
        }
    }, 1000);
}
