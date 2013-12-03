define(['jquery','jquery_animate_enhanced','TEnvironment'], function($,animate_enhanced,TEnvironment) {
    function TGraphicalObject() {
        var env = TEnvironment.instance();
        var domObject = document.createElement("div");
        
        var debug = false;
        
        if (debug) {
            domObject.style.backgroundColor="green";
            domObject.style.width="10px";
            domObject.style.height="10px";
        }
        
        domObject.style.position="absolute";

        var canvas = env.getCanvas();

        this.getElement = function () {
            return domObject;
        };
        
        this.deleteObject = function() {
            canvas.removeGraphicalObject(this);
        };

        canvas.addGraphicalObject(this);
    }

    return TGraphicalObject;
});