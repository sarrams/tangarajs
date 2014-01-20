define(['jquery','jquery_animate_enhanced','TEnvironment'], function($, animate_enhanced, TEnvironment) {
    function TGraphicalObject() {
        this.qObject = new this.qSprite();
        this.load();
        var canvas = TEnvironment.getCanvas();
        canvas.addGraphicalObject(this);
    }

    TGraphicalObject.prototype.className = "";
    
    var qInstance = TEnvironment.getQuintusInstance();
    
    qInstance.Sprite.extend("TGraphicalObject",{
      init: function(props,defaultProps) {
            this._super(qInstance._extend({
                designMode: false
            },props),defaultProps);
      },
      drag: function(touch) {
        //if (this.p.designMode) {
          this.p.dragging = true;
          this.p.x = touch.origX + touch.dx;
          this.p.y = touch.origY + touch.dy;
        //}
       },
      touchEnd: function(touch) {
        //if (this.p.designMode) {
          this.p.dragging = false;
        //}
      },
      w:10,
      h:10,
      x:0,
      y:0});
    
    TGraphicalObject.prototype.qSprite = qInstance.TGraphicalObject;

    TGraphicalObject.prototype.messages = new Array();

    TGraphicalObject.prototype.getSprite = function () {
        return this.qObject;
    };

    TGraphicalObject.prototype.load = function() {
        var messageFile = this.getResource("messages.json");
        var language = TEnvironment.getLanguage();
        var parent = this;

        if (this.className.length !== 0) {
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
        TEnvironment.deleteTObject(this);
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
    
    TGraphicalObject.prototype.getQObject = function() {
        return this.qObject;
    };
    
    TGraphicalObject.prototype._delete = function() {
        this.deleteObject();
    };
    
    TGraphicalObject.prototype._setDesignMode = function(value) {
        if (value) {
          /*this.qObject.on("drag");
          this.qObject.on("touchEnd");*/
          var qObject = this.qObject;
          qObject.on("drag");
          qObject.on("touchEnd");
          for (var i=0; i<qObject.children.length; i++) {
            qObject.children[i].on("drag");
            qObject.children[i].on("touchEnd");
          }
          this.qObject.p.designMode = true;
        } else {
          /*this.qObject.off("drag");
          this.qObject.off("touchEnd");*/
          qObject.off("drag");
          qObject.off("touchEnd");
          for (var i=0; i<qObject.children.length; i++) {
            qObject.children[i].off("drag");
            qObject.children[i].off("touchEnd");
          }
          this.qObject.p.designMode = false;
        }
    };

    return TGraphicalObject;
});