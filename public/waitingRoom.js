
let xpos = 0;
let anim = false;

function setup() {
  width = window.innerWidth;
  height = window.innerHeight;
  var myCanv = createCanvas(width, height);
  myCanv.parent("waitingRoom");
  
}

function draw() {
  clear();
  fill(0);
  rect(xpos,0,width, height);

  if(anim){
    xpos+=4;
    if(xpos>width){
      killWR();
    }
  }
}

