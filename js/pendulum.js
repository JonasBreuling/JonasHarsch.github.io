var tail = 250;
var g = 9.8;
// var dt = 0.0175;
var dt = 0.0175;
var color1 = "rgba(255, 255, 255,";
var color2 = ")";

var canvas = document.getElementById("myCanvas");
var canvasContext = canvas.getContext("2d");

canvasContext.translate(100, 100);
canvasContext.rotate(Math.PI/2);

function setup() { 
    dp = new DoublePendulum();
    pts2 = [];
    // prepopulate pts2 array
    for(i = 0;i < tail; i++) {
        pts2.push(createVector(dp.x2, dp.y2));
    }
} 
  
function draw() {
    canvasContext.translate(-100, -100);
    canvasContext.clearRect(0, 0, 410, 410);
    canvasContext.translate(100, 100);

    // update ODE
    dp.update();
    
    // remember new tail position
    pts2.shift();
    pts2.push(createVector(dp.x2, dp.y2));

    // draw tail positions
    for(i = 1; i < tail; i++) {
        canvasContext.beginPath();
        canvasContext.moveTo(pts2[i-1].x, pts2[i-1].y);
        canvasContext.lineTo(pts2[i].x, pts2[i].y);
        canvasContext.strokeStyle="rgba("+255+","+255+","+255+","+(i / tail)+")";
        canvasContext.lineWidth = 1;
        canvasContext.stroke();
    }
    
    dp.display();		
}

function DoublePendulum() {
  // set variables
	var l1 = 50;
	var l2 = 40;
	var m1 = 100;
  var m2 = 100;
  var delta = 0;
  
  // initial conditions
	this.theta1 = -PI / 2;
	this.theta2 = -PI / 2;
	this.w1 = 0;
	this.w2 = 0;
	this.dw1 = 0;
	this.dw2 = 0;
	this.x1 = l1 * cos(this.theta1);
	this.y1 = l1 * sin(this.theta1);
  this.x2 = this.x1 + l2 * cos(this.theta2);
  this.y2 = this.y1 + l2 * sin(this.theta2);

  // equations of motion, see http://www.physics.usyd.edu.au/~wheat/dpend_html/
  this.f = [];
  this.f[0] = function(a, b, c, d){
    return c;
  }
  this.f[1] = function(a, b, c, d){
    return d;
  }
  this.f[2] = function(a, b, c, d){
    // return (-1*g*(2*m1+m2)*sin(a)-m2*g*sin(a-2*b)-2*sin(a-b)*m2*(sq(d)*l2+sq(c)*l1*cos(a-b)))/(l1*(2*m1+m2-m2*cos(2*a-2*b)))
    delta = b-a;
    return (m2*l1*d*d*sin(delta)*cos(delta) + m2*g*sin(b)*cos(delta) + m2*l2*d*d*sin(delta) - (m1+m2)*g*sin(a)) / ((m1+m2)*l1 - m2*l1*cos(delta)*cos(delta))
  };
  this.f[3] = function(a, b, c, d){
    // return (2*sin(a-b)*(sq(c)*l1*(m1+m2)+g*(m1+m2)*cos(a)+sq(d)*l2*m2*cos(a-b)))/(l2*(2*m1+m2-m2*cos(2*a-2*b)))
    delta = b-a;
    return (-m2*l2*d*d*sin(delta)*cos(delta) + (m1+m2)*(g*sin(a)*cos(delta) - l1*c*c*sin(delta) - g*sin(b))) / ((m1+m2)*l2 - m2*l2*cos(delta)*cos(delta))
  };

  // generlaized coordinates vector
  this.X = [this.theta1, this.theta2, this.w1, this.w2];
  
  // compute timestep
	this.update = function() {
    for( var i = 0; i <= 4; i++){
        this.X = RungeKutta4(this.f, this.X, dt);   
        // this.X = EulerExplicit(this.f, this.X, dt);   
    }
    this.x1 = l1 * cos(this.X[0]);
    this.y1 = l1 * sin(this.X[0]);
    this.x2 = this.x1 + l2 * cos(this.X[1]);
    this.y2 = this.y1 + l2 * sin(this.X[1]);
  }
  
  // draw new position of th ependulum
	this.display = function() {   
        canvasContext.beginPath();     
        canvasContext.moveTo(0,  0);
        canvasContext.lineTo(this.x1, this.y1);
        canvasContext.strokeStyle="white";
        canvasContext.lineWidth=2;
        canvasContext.stroke();
        
        canvasContext.beginPath();
        canvasContext.moveTo(this.x1, this.y1);
        canvasContext.lineTo(this.x2, this.y2);
        canvasContext.strokeStyle="white";
        canvasContext.lineWidth=2;
        canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.arc(this.x1, this.y1, 5, 0, 2*Math.PI);
        canvasContext.fillStyle="white";
        canvasContext.fill();

        canvasContext.beginPath();
        canvasContext.arc(this.x2, this.y2, 5, 0, 2*Math.PI);
        canvasContext.fillStyle="white";
        canvasContext.fill();

        canvasContext.beginPath();
        canvasContext.arc(0, 0, 5, 0, 2*Math.PI);
        canvasContext.fillStyle="white";
        canvasContext.fill();
	}
}

// helper array sum
arraySum = function(foo,bar){
  var foobar = [];
  
  for (var i = 0; i<foo.length; i++){
    foobar[i] = foo[i]+bar[i];
  }
  return foobar;
};

// helper array multiplication
arrayMult = function(foo,k){
  var foobar = [];
  for (var i = 0; i<foo.length; i++){
    foobar[i] = foo[i]*k;
  }
  return foobar;
};

// explicit Euler method
EulerExplicit = function(f, y, h) {
  var y_n = [];
  var f_n = [];

  for (i = 0; i < y.length; i++){
    f_n[i] = f[i].apply(null, y);
  }

  for (i = 0; i < y.length; i++) {
    y_n[i] = y[i] + h * f_n[i];
  }

  return y_n;
};

// Runge-Kutta 4 Method
RungeKutta4 = function(f, y, h) {
  var k1 = [];
  var k2 = [];
  var k3 = [];
  var k4 = [];
  var y_n = [];
  
  for (i = 0; i < y.length; i++){
    k1[i] = f[i].apply(null, y);
  }
  
  y_n = arraySum(y, arrayMult(k1,h/2));
  
  for (i = 0; i < y.length; i++) {
    k2[i] = f[i].apply(null, y_n);
  }

  y_n = arraySum(y, arrayMult(k2, h/2));
  
  for (i = 0; i < y.length; i++) {
    k3[i] = f[i].apply(null, y_n);
  }

  y_n = arraySum(y, arrayMult(k3, h));
  
  for (i = 0; i < y.length; i++) {
    k4[i] = f[i].apply(null, y_n);
  }
  
  for (i = 0; i < y.length; i++) {
    y_n[i] = y[i] + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  
  return y_n;
};