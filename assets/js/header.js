window.onscroll = function() {
  // moveTitle();
  stickyHeader();
};

var pageHeight = screen.height / 1.3;
var content =  document.getElementsByClassName("header-content")[0];
// var content = document.getElementById("header-content");

// var navbar = document.getElementById("navbar");
var navbar =  document.getElementsByClassName("navbar")[0];
var sticky = navbar.offsetTop;

function moveTitle() {

  i = parseInt( 10 + ($(this).scrollTop() / pageHeight) * 120);
  if (i < 50) {
    content.style["top"] = "" + i + "%";
  }

}

function stickyHeader() {
  // document.write("124");

  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }

}