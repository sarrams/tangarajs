define(['jquery','objects/TGraphicalObject'], function($, TObject) {

    function TCanvas() {
        var domCanvas = document.createElement("div");
        domCanvas.id = "tcanvas";

        var graphicalObjects = new Array();

        this.addGraphicalObject = function(object) {
            graphicalObjects.push(object);
            $(domCanvas).append(object.getElement());
        };

        this.removeGraphicalObject = function(object) {
            var index = graphicalObjects.indexOf(object);
            if (index > -1) {
                domCanvas.removeChild(object.getElement());
                graphicalObjects.splice(index, 1);
            }
        };
        
        this.getElement = function() {
            return domCanvas;
        };
        
        this.displayed = function() {
            return;
        };
        
        this.clear = function() {
            while (graphicalObjects.length>0) {
                graphicalObjects[0].deleteObject();
            }
        };

    }

    return TCanvas;
    
});