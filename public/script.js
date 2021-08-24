var socket = io.connect();
var testText = "default";
var buttonState;

window.focus();

//standard socket functions for connections
socket.on('connect', function() {
    document.getElementById('clientId').innerHTML = `Client ID: ${socket.id}`
})

socket.on('clientList', function(data) {
    document.getElementById('clientCount').innerHTML = `${data.length} Clients Connected`
})

socket.on('connect', function() {
    document.getElementById('clientId').innerHTML = `Client ID: ${socket.id}`
})

// Interactivity and Display triggers

socket.on('buttonSwitch', function(_buttonState) {
    buttonState=_buttonState;
    if(!buttonState){
        document.getElementById('buttonOff').style.display = "block";
        document.getElementById('image').style.display = "none";
    }else {
        document.getElementById('buttonOff').style.display = "none";
        document.getElementById('image').style.display = "block";
    }
})

function displayTime(){
    socket.emit('displayTime', testText);
}

function displayImage(){
    socket.emit('displayImage', testText);
}

function nextTrack(){
    socket.emit('nextTrack', testText);
}

function effect(){
    socket.emit('effect', testText);
}

function killWR(){
    document.getElementById('waitingRoom').hidden=true;
    document.getElementById('countdown').hidden=true;
}

socket.on('killWR', function(state) {
    if(state == 1){
        killWR();
    }
})


//post triggered methods
socket.on('setButton', function(_buttonState) {
    buttonState=_buttonState;
    socket.emit('buttonSwitch', buttonState);
})

socket.on('title', function(title) {
    document.getElementById('title').innerHTML = title;
})

socket.on('author', function(author) {
    document.getElementById('author').innerHTML = author;
})

socket.on('next', function(trackID) {
    nextImage(trackID);
})

socket.on('effect', function(e) {
    toggle = true;
})

socket.on('vibrate', function(duration) {
    navigator.vibrate(duration);
    console.log("vibrate")
})

socket.on('setCountdown', function(duration) {
    var display = document.getElementById("countdown");
    display.innerHTML = duration;
})

//test
socket.on('httpBack', function(testText) {
    document.getElementById('currentInfo').innerHTML = testText;
})

socket.on('endCountdown', function(time){
    anim=true;
    document.getElementById('countdown').hidden = true;
})

// Image Crossfade Code
var currentImg = 0;
var imageDisplaying = false;

function nextImage(trackID) {
    var e;
    // remove showMe class from current image
    if(imageDisplaying){
        e = document.getElementById("slideimg" + currentImg);
        removeClass(e, "showMe");
    }

    // add showMe class to next image
    e = document.getElementById("slideimg" + trackID);
    addClass(e, "showMe");
    imageDisplaying = true;
    currentImg = trackID;
}

//add remove class functions
function addClass(elem, name) {
    var c = elem.className;
    if (c) c += " ";  // if not blank, add a space separator
    c += name;
    elem.className = c;
}

function removeClass(elem, name) {
    var c = elem.className;
    elem.className = c.replace(name, "").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");  // remove name and extra blanks
}
