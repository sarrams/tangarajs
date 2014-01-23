define(['jquery','TEnvironment', 'TUtils', 'objects/TGraphicalObject'], function($, TEnvironment, TUtils, TGraphicalObject) {
    var Sprite = function(name) {
        window.console.log("Initializing sprite");
        TGraphicalObject.call(this);
        if (typeof name !== 'unefined') {
          this._loadResource(name);
        }
    };
    
    Sprite.prototype = new TGraphicalObject();
    
    var qInstance = TEnvironment.getQuintusInstance();
    
    qInstance.TGraphicalObject.extend("TSprite", {
        init: function(props,defaultProps) {
            this._super(qInstance._extend({
                destinationX: 0,
                destinationY: 0,
                velocity:200
            },props),defaultProps);
        },
        step: function(dt) {
            var p = this.p;
            if (!p.dragging) {
              var step = p.velocity*dt; 
              if (p.x < p.destinationX) {
                  p.x = Math.min(p.x+step, p.destinationX); 
              } else if (p.x > p.destinationX) {
                  p.x = Math.max(p.x-step, p.destinationX); 
              }
              if (p.y < p.destinationY) {
                  p.y = Math.min(p.y+step, p.destinationY); 
              } else if (p.y > p.destinationY) {
                  p.y = Math.max(p.y-step, p.destinationY); 
              }
            }
        }
      });
      
    Sprite.prototype._moveForward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationX+=value;
        }
        return;
    };

    Sprite.prototype._moveBackward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationX-=value;
        }
        return;
    };
        
    Sprite.prototype._moveUpward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationY-=value;
        }
        return;
    };

    Sprite.prototype._moveDownward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationY+=value;
        }
        return;
    };
    
    Sprite.prototype._stop = function() {
        this.qObject.p.destinationX = this.qObject.p.x;
        this.qObject.p.destinationY = this.qObject.p.y;
        return;
    };


    
    Sprite.prototype._loadResource = function(name) {
        asset = TEnvironment.getUserResource(name);
        var qObject = this.qObject;
        qInstance.load(asset,function() {
            qObject.p.asset = asset;
              for (var i=0; i<elements.length; i++) {
                  var val = elements[i];
                  var element = new qInstance.CharacterPart({asset:baseImageUrl+ val['image'], name:val['name']});
                  if (typeof val['cx'] !== 'undefined') {
                    element.p.cx = val['cx'];
                  }
                  if (typeof val['cy'] !== 'undefined') {
                    element.p.cy = val['cy'];
                  }
                  element.p.x = val['coordinateX']+element.p.cx;
                  element.p.y = val['coordinateY']+element.p.cy;
                  qStage.insert(element, qObject);
                  switch(val['name']) {
                    case 'leftArm' : 
                      character.leftElement = element;
                      leftArm = element;
                      break;
                    case 'rightArm' :
                      character.rightElement = element;
                      rightArm = element;
                      break;
                    case 'leftLeg' : 
                      character.leftElement = element;
                      break;
                    case 'rightLeg' :
                      character.rightElement = element;
                      break;
                    case 'chest' :
                      chest = element;
                      break;
                  }
                  element.startAnimation();
              }
              if (chest !== null) {
                chest.p.leftArm = leftArm;
                chest.p.rightArm = rightArm;
              }
              if (character.initialize) {
                  qObject.p.x = qObject.p.w/2;
                  qObject.p.y = qObject.p.h/2;
                  qObject.p.destinationX = qObject.p.x;
                  qObject.p.destinationY = qObject.p.y;
                  this.initialize = false;
              }
          });
    };
    
    return Sprite;
});



