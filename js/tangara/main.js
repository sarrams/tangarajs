require.config({
    baseUrl:'js/tangara',

    paths: {
        jquery:'../libs/jquery-1.9.0/jquery.min',
        jquery_animate_enhanced:'../libs/jquery.animate-enhanced/jquery.animate-enhanced.min',
        ace:'../libs/ace'
    }
});

//window.location.protocol + "//" + window.location.host+ window.location.pathname.split("/").slice(0, -1).join("/")+"/js/tangara",
//baseUrl: 'js/tangara',
// Start the main app logic.
require(['jquery', 'TFrame'],function($, TFrame) {
    $(document).ready( function() {
        frame = new TFrame();
        domFrame = frame.getElement();
        $("body").append(domFrame);
        frame.displayed();
    });
   
});


