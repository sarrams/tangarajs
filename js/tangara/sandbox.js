require.config({
    "baseUrl":'js/tangara',

    paths: {
        "jquery":'../libs/jquery-1.9.0/jquery.min',
        "jquery_animate_enhanced":'../libs/jquery.animate-enhanced/jquery.animate-enhanced.min'
    }
});

require(['jquery'],function($) {
    $(document).ready( function() {
        window.thatObject = Object.create(null);
        window.execute = function(commands) {
            var objectsSandbox = new Function('window', 'document', commands);
            var thisSandbox  = objectsSandbox.bind(window.thatObject);
            thisSandbox({}, {});
        };
        parent.bindSandbox(window.execute);
    });
   
});


