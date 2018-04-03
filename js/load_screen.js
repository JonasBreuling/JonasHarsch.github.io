window.addEventListener("load", function() {
    // var load_screen = document.getElementById("load_screen");
    // this.document.body.removeChild(load_screen);
    // jQuery('.loading-page-bg').delay(3000).fadeOut(500);
    jQuery('.loading-page-bg').delay(1000).fadeOut(1000);
});

// var readyStateCheckInterval = setInterval(function() {
//     if (document.readyState === "complete") {
//         clearInterval(readyStateCheckInterval);
//         var load_screen = document.getElementById("load_screen");
//         this.document.body.removeChild(load_screen);
//     }
// }, 10);

/*
document.onreadystatechange = function () {
    var state = document.readyState
    if (state == 'complete') {
        setTimeout(function(){
            document.getElementById('interactive');
            // document.getElementById('load').style.visibility="hidden";
            jQuery('#load').delay(1000).fadeOut(1000);
        }, 4000);
    }
}
*/

// jQuery(document).ready(function() {
    /*
$(document).ready(function() {
    jQuery('.loading-page-bg').delay(1000).fadeOut(500);
});
*/

/*
$(document).ready(function() {
  
    var counter = 0;
    var c = 0;
    var i = setInterval(function(){
        $(".loading-page .counter h1").html(c + "%");
        $(".loading-page .counter hr").css("width", c + "%");
      
      counter++;
      c++;
        
      if(counter == 101) {
          clearInterval(i);
      }
    }, 5);
});
*/