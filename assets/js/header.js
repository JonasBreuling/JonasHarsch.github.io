window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

// Array of images to swap between
var images = [];

// Add 5 items to array
for (i = 0; i < 6; i++) {
  images.push('assets/images/beam' + i + '.svg');
}

var totalImages = images.length;
var pageHeight = screen.height / 1.3;

// Work out how often we should change image (i.e. how far we scroll between changes)
var scrollInterval = Math.floor(pageHeight / totalImages);

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }

  // Which one should we show at this scroll point?
  i = Math.floor($(this).scrollTop() / scrollInterval);
  if (i >= totalImages) {
    i = totalImages - 1;
  }
  // Show the corresponding image from the array
  // $('img').attr('src', images[i]);
  document.getElementById("beam_id").src=images[i];
}