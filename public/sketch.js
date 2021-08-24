let toggle = false;
let count = 0;
let duration = 400;

function setup() {
  width = window.innerWidth;
  height = window.innerHeight;
  var myCanv = createCanvas(width, height);
  myCanv.parent("canvas");
}

function draw() {
  noStroke();
  noFill();
  clear();
  ellipseMode(CENTER);

//strobe effect
  if (toggle){
    if(count%4==0){
      fill(255,0,0);
      console.log("flash")
    } else {
      fill(255,255,0);
    }

    if(count>=duration){
      toggle = false;
      count = 0;
      fill(255,255,0);
    }
    count++;
  }
  
  ellipse(width/2, height/2, 7500,7500);
  
}

