// see https://stackoverflow.com/questions/21561480/trigger-event-when-user-scroll-to-specific-element-with-jquery
// for infomration about registrating when skill bars are reached

// $(function() {
//     $(window).scroll(function() {
//     var hT = $('#skill-bar-wrapper').offset().top,
//         hH = $('#skill-bar-wrapper').outerHeight(),
//         wH = $(window).height(),
//         wS = $(this).scrollTop();
//     // if (wS > (hT+hH-wH)){
//     if (wS > (hT+hH-1.4*wH)){
//         jQuery(document).ready(function(){
//             jQuery('.skillbar-container').each(function(){
//                 jQuery(this).find('.skills').animate({
//                     width:jQuery(this).attr('data-percent')
//                 }, 5000); // 5 seconds
//             });
//         });
//     }
//     });
// });


/*
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
*/

/*
$(window).scroll(function(){

    // jQuery(document).ready(function(){
    if (isScrolledIntoView('.skillbar-container') === true) {
        jQuery('.skillbar-container').each(function(){
            jQuery(this).find('.skills').animate({
                width:jQuery(this).attr('data-percent')
            }, 5000); // 5 seconds
        });
    } else {
        jQuery('.skillbar-container').each(function(){
            jQuery(this).find('.skills').animate({
                width: "0px"
            }, 0); // 5 seconds
            // jQuery(this).find('.skills').animate({width: "0%"}, 5000);
            // jQuery(this).find('.skills').attr( "width", "0%" );
        });
    } 
    
    // if (isScrolledIntoView('.skillbar-container') === false) {
    //         jQuery('.skillbar-container').each(function(){
    //             jQuery(this).find('.skills').attr( "width", "100%" );
    //         });
    //         // jQuery('.skillbar-container').each(function(){
    //         //     jQuery(this).find('.skills').animate({width: "0%"}, 5000);
    //         // });
    // }
    // });

});
*/


function Utils() {

}

Utils.prototype = {
    constructor: Utils,
    isElementInView: function (element, fullyInView) {
        var pageTop = $(window).scrollTop();
        var pageBottom = pageTop + $(window).height();
        var elementTop = $(element).offset().top;
        var elementBottom = elementTop + $(element).height();

        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    }
};

var Utils = new Utils();

$(window).scroll(function(){
    var isElementInView = Utils.isElementInView($('.skillbar-container'), true);
    
    if (isElementInView) {
        jQuery('.skillbar-container').each(function(){
            jQuery(this).find('.skills').animate({
                width:jQuery(this).attr('data-percent')
            }, 5000); // 5 seconds
        });
    // } else {
    //     jQuery('.skillbar-container').each(function(){
    //         jQuery(this).find('.skills').animate({
    //             width: "0px"
    //         }, 1); // 5 seconds
    //     });
    }
});