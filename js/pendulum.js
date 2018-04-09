var tail = 250;
var g = 9.8;
var dt = 0.02;
var color1 = "rgba(255, 255, 255,";
var color2 = ")";

var canvas = document.getElementById("myCanvas");
var canvasContext = canvas.getContext("2d");

// canvasContext.translate(105, 105);
canvasContext.translate(100, 100);
canvasContext.rotate(Math.PI/2);

function setup() { 
    dp = new DblPen();
    // pts1 = [];
    pts2 = [];
    /*
    for(i=0;i<tail;i++){ //prepopulate pts1 array
        pts1.push(createVector(dp.x1,dp.y1));
    }
    */
    for(i=0;i<tail;i++){ //prepopulate pts2 array
        pts2.push(createVector(dp.x2,dp.y2));
    }
} 
  
function draw() {
    // canvasContext.clearRect(0, 0, 410, 410);
    canvasContext.clearRect(0, 0, -205, -205);
    canvasContext.clearRect(0, 0, 205, -205);
    canvasContext.clearRect(0, 0, -205, 205);
    canvasContext.clearRect(0, 0, 205, 205);

    dp.update();
    
    /*
    pts1.shift();
    pts1.push(createVector(dp.x1,dp.y1));
    */
    pts2.shift();
    pts2.push(createVector(dp.x2,dp.y2));

    for(i=1; i<tail; i++){
        // canvasContext.beginPath();
        // canvasContext.moveTo(pts1[i-1].x, pts1[i-1].y);
        // canvasContext.lineWidth=1;
        // canvasContext.lineTo(pts1[i].x, pts1[i].y);
        // canvasContext.strokeStyle="white";
        // canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.moveTo(pts2[i-1].x, pts2[i-1].y);
        canvasContext.lineTo(pts2[i].x, pts2[i].y);
        // canvasContext.strokeStyle="#5b5b5b";
        // canvasContext.strokeStyle="#919191";
        // canvasContext.strokeStyle="white";
        canvasContext.strokeStyle="rgba("+255+","+255+","+255+","+(i / tail)+")";
        canvasContext.lineWidth=1;
        canvasContext.stroke();
        // canvasContext.fill();
    }
    
    dp.display();		
}

function DblPen() {
	var l1 = 50;
	var l2 = 40;
	var m1 = 100;
	var m2 = 100;
	this.theta1 = PI/2;
	this.theta2 = PI/2+random();
	this.w1 = 0;
	this.w2 = 0;
	this.dw1 = 0;
	this.dw2 = 0;
	this.x1 = l1*cos(this.theta1);
	this.y1 = l1*sin(this.theta1);
    this.x2 = this.x1+l2*cos(this.theta2);
    this.y2 = this.y1+l2*sin(this.theta2);
    this.f = [];
    this.f[0] = function(a,b,c,d){return c;}
    this.f[1] = function(a,b,c,d){return d;}
    this.f[2] = function(a,b,c,d){return (-1*g*(2*m1+m2)*sin(a)-m2*g*sin(a-2*b)-2*sin(a-b)*m2*(sq(d)*l2+sq(c)*l1*cos(a-b)))/(l1*(2*m1+m2-m2*cos(2*a-2*b)))};
    this.f[3] = function(a,b,c,d){return (2*sin(a-b)*(sq(c)*l1*(m1+m2)+g*(m1+m2)*cos(a)+sq(d)*l2*m2*cos(a-b)))/(l2*(2*m1+m2-m2*cos(2*a-2*b)))};
    this.X = [this.theta1,this.theta2,this.w1,this.w2];
  
	this.update = function() {
        for( var i = 0;i<5;i++){
            this.X = RK4(this.f, this.X, dt);   
        }
        this.x1 = l1*cos(this.X[0]);
        this.y1 = l1*sin(this.X[0]);
        this.x2 = this.x1+l2*cos(this.X[1]);
        this.y2 = this.y1+l2*sin(this.X[1]);
      }
	
	this.display = function() {   
        canvasContext.beginPath();     
        canvasContext.moveTo(0,  0);
        canvasContext.lineTo(this.x1, this.y1);
        canvasContext.strokeStyle="white";
        // canvasContext.lineWidth=1;
        canvasContext.lineWidth=2;
        canvasContext.stroke();
        
        canvasContext.beginPath();
        canvasContext.moveTo(this.x1, this.y1);
        canvasContext.lineTo(this.x2, this.y2);
        canvasContext.strokeStyle="white";
        // canvasContext.lineWidth=1;
        canvasContext.lineWidth=2;
        canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.arc(this.x1, this.y1, 5, 0, 2*Math.PI);
        // canvasContext.arc(this.x1, this.y1, 10, 0, 2*Math.PI);
        canvasContext.fillStyle="white";
        canvasContext.fill();

        canvasContext.beginPath();
        canvasContext.arc(this.x2, this.y2, 5, 0, 2*Math.PI);
        // canvasContext.arc(this.x2, this.y2, 10, 0, 2*Math.PI);
        canvasContext.fillStyle="white";
        canvasContext.fill();

        canvasContext.beginPath();
        canvasContext.arc(0, 0, 5, 0, 2*Math.PI);
        // canvasContext.arc(0, 0, 8.0, 0, 2*Math.PI);
        canvasContext.fillStyle="white";
        canvasContext.fill();
	}
}

arraySum = function(foo,bar){
  var foobar = [];
  
  for (var i = 0; i<foo.length; i++){
    foobar[i] = foo[i]+bar[i];
  }
  return foobar;
};

arrayMult = function(foo,k){
  var foobar = [];
  for (var i = 0; i<foo.length; i++){
    foobar[i] = foo[i]*k;
  }
  return foobar;
};


RK4 = function(f,x,h){
  var a = [];
  var b = [];
  var c = [];
  var d = [];
  var xnew = [];
  
  for (i=0; i<x.length; i++){
    a[i] = f[i].apply(null,x);
  }
  
  xnew = arraySum(x,arrayMult(a,h/2));
  
  for (i=0; i<x.length; i++){
    b[i] = f[i].apply(null,xnew);
  }
  xnew = arraySum(x,arrayMult(b,h/2));
  
  for (i=0; i<x.length; i++){
    c[i] = f[i].apply(null,xnew);
  }
  xnew = arraySum(x,arrayMult(c,h));
  
  for (i=0; i<x.length; i++){
    d[i] = f[i].apply(null,xnew);
  }
  
  for (i=0; i<x.length; i++){
    xnew[i] = x[i]+h/6*(a[i]+2*b[i]+2*c[i]+d[i]);
  }
  
  return xnew;
};