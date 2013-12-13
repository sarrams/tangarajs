define(['jquery','jquery_animate_enhanced','TEnvironment'], function($,animate_enhanced,TEnvironment) {
    function TGraphicalObject() {
        this.domObject = document.createElement("div");
        this.domObject.style.position="absolute";
        var canvas = TEnvironment.instance().getCanvas();
        canvas.addGraphicalObject(this);
    }

    TGraphicalObject.prototype.className = "";

    TGraphicalObject.prototype.getElement = function () {
        return this.domObject;
    };
        
    TGraphicalObject.prototype.deleteObject = function() {
        var canvas = TEnvironment.instance().getCanvas();
        canvas.removeGraphicalObject(this);
    };
        
    TGraphicalObject.prototype.getResource = function(location) {
        return TEnvironment.instance().getObjectsUrl()+"/"+this.className.toLowerCase()+"/resources/"+location;
    };


    return TGraphicalObject;
});