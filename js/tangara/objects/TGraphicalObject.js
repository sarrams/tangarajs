define(['jquery','jquery_animate_enhanced','TEnvironment'], function($,animate_enhanced,TEnvironment) {
    function TGraphicalObject() {
        this.domObject = document.createElement("div");
        this.domObject.style.position="absolute";
        var canvas = TEnvironment.getCanvas();
        this.load();
        canvas.addGraphicalObject(this);
    }

    TGraphicalObject.prototype.className = "";

    TGraphicalObject.prototype.messages = new Array();


    TGraphicalObject.prototype.getElement = function () {
        return this.domObject;
    };

    TGraphicalObject.prototype.load = function() {
        var messageFile = this.getResource("messages.json");
        var language = TEnvironment.getLanguage();
        var parent = this;

        if (this.className.length != 0) {
        $.ajax({
            dataType: "json",
            url: messageFile,
            async: false,
            success: function(data) {
                if (typeof data[language] !== 'undefined'){
                    parent.messages = data[language];
                    window.console.log("found messages in language: "+language);
                } else {
                    window.console.log("found no messages for language: "+language);
                }
            }
        });
      }
    };


    TGraphicalObject.prototype.deleteObject = function() {
        var canvas = TEnvironment.getCanvas();
        canvas.removeGraphicalObject(this);
    };

    TGraphicalObject.prototype.getResource = function(location) {
        return TEnvironment.getObjectsUrl()+"/"+this.className.toLowerCase()+"/resources/"+location;
    };

    TGraphicalObject.prototype.getMessage = function(code) {
        if (typeof this.messages[code] !== 'undefined') {
            return this.messages[code];
        } else {
            return code;
        }
    };

    return TGraphicalObject;
});