define(['jquery','TEnvironment', 'TUtils', 'objects/TGraphicalObject'], function($, TEnvironment, TUtils, TGraphicalObject) {
    var Character = function(characterName) {
        window.console.log("Initializing character");
        TGraphicalObject.call(this);
        window.console.log("Character initialized");
        if (typeof(characterName)==='undefined') {
            characterName = "boy";
        } else {
            var simplifiedName = TUtils.removeAccents(characterName);
            characterName = this.getMessage(simplifiedName);
        }
        var initialize = true;
        var leftElement, rightElement;
        this._loadSkeleton(characterName);
    };

    Character.prototype = new TGraphicalObject();

    Character.prototype.className = "Character";
        
    var qInstance = TEnvironment.getQuintusInstance();
    
    
    qInstance.TGraphicalObject.extend("Character", {
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
        },
        drag: function(touch) {
          for (var i=0; i<this.children.length; i++) {
            this.children[i].stopAnimation();
          }
          if (!this.p.dragging) {
            touch.origX = this.p.x;
            touch.origY = this.p.y;
          }
          this._super(touch);
        },
        touchEnd: function(touch) {
          this.p.destinationX = this.p.x;
          this.p.destinationY = this.p.y;
          this._super(touch);
          for (var i=0; i<this.children.length; i++) {
            this.children[i].startAnimation();
          }
        }

    });

    qInstance.Sprite.extend("CharacterPart", {
        init: function(props,defaultProps) {
            this._super(qInstance._extend({
                name:"",
                moveUp:true,
                initialized:false,
                rotationSpeed:0.025,
                leftArm:null,
                rightArm:null,
                moving:false,
                initX:0,
                initY:0,
                initAngle:0
            },props),defaultProps);
            this.add("tween");
        },
        drag: function(touch) {
          this.container.drag(touch);
        },
        touchEnd: function(touch) {
          this.container.touchEnd(touch);
        },
        startAnimation: function() {
            this.p.initX = this.p.x;
            this.p.initY = this.p.y;
            this.p.initAngle = this.p.angle;
            this.p.moveUp = true;
            if (this.p.name === "chest" || this.p.name === "tail")  {
              this.breathe();
            }
        },
        breathe: function() {
          var p = this.p;
          switch (p.name) {
            case 'chest' :
              // movement with chest and arms
              if (p.moveUp) {
                  this.animate({y:p.y-3},1, qInstance.Easing.Linear, {callback:this.breathe});
              } else {
                  this.animate({y:p.y+3},1, qInstance.Easing.Linear, {callback:this.breathe});
              }
              if (p.leftArm !== null) {
                p.leftArm.p.moveUp = p.moveUp;
                p.leftArm.breathe();
              }
              if (p.rightArm !== null) {
                p.rightArm.p.moveUp = p.moveUp;
                p.rightArm.breathe();
              }
              p.moveUp = !p.moveUp;
              break;
            case 'tail' :
              // movement with only tail
              if (p.moveUp) {
                  this.animate({angle:p.angle+4},1, qInstance.Easing.Linear, {callback:this.breathe});
              } else {
                  this.animate({angle:p.angle-4},1, qInstance.Easing.Linear, {callback:this.breathe});
              }
              p.moveUp = !p.moveUp;
              break;
            case 'rightArm' :
              if (!p.moving) {
                if (p.moveUp) {
                    this.animate({angle:p.angle+4},1, qInstance.Easing.Linear);
                } else {
                    this.animate({angle:p.angle-4},1, qInstance.Easing.Linear);
                }
              }
              break;
            case 'leftArm' :
              if (!p.moving) {
                if (p.moveUp) {
                    this.animate({angle:p.angle-4},1, qInstance.Easing.Linear);
                } else {
                    this.animate({angle:p.angle+4},1, qInstance.Easing.Linear);
                }
              }
              break;
          }
        },
        stopAnimation: function() {
          this.stop();
          this.p.x = this.p.initX;
          this.p.y = this.p.initY;
          this.p.angle = this.p.initAngle;
        },
        raise: function(value) {
          p = this.p;
          p.moving = true;
          this.stopAnimation();
          var duration = Math.abs(value*p.rotationSpeed);
          this.animate({angle:p.angle + value},duration, qInstance.Easing.Linear, {callback:this.stopMoving});
        },
        lower: function(value) {
          p = this.p;
          p.moving = true;
          this.stopAnimation();
          var duration = Math.abs(value*this.p.rotationSpeed);
          this.animate({angle:this.p.angle - value},duration, qInstance.Easing.Linear, {callback:this.stopMoving});
        },
        stopMoving: function() {
          this.p.initAngle=this.p.angle;
          this.p.moving=false;
        }
    });

    
    Character.prototype.qSprite = qInstance.Character;

    Character.prototype._moveForward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationX+=value;
        }
        return;
    };

    Character.prototype._moveBackward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationX-=value;
        }
        return;
    };
        
    Character.prototype._moveUpward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationY-=value;
        }
        return;
    };

    Character.prototype._moveDownward = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.qObject.p.destinationY+=value;
        }
        return;
    };
    
    Character.prototype._stop = function() {
        this.qObject.p.destinationX = this.qObject.p.x;
        this.qObject.p.destinationY = this.qObject.p.y;
        return;
    };
        
    Character.prototype._loadSkeleton = function(name) {
        if (typeof name !== 'undefined' && (typeof name === 'string' || name instanceof String)) {
          window.console.log("loading skeleton");
          var baseImageUrl = this.getResource(name)+"/";
          var skeletonUrl = baseImageUrl+"skeleton.json";
          window.console.log("Skeleton URL : "+skeletonUrl);
          var parent = this;
          var elements = new Array();
          var assets = new Array();
          $.ajax({
              dataType: "json",
              url: skeletonUrl,
              async: false,
              success: function(data) {
                  $.each( data['skeleton']['element'], function( key, val ) {
                      elements.push(val);
                      assets.push(baseImageUrl+val['image']);
                  });
              }
          }).fail(function(jqxhr, textStatus, error) {
              throw new Error(TUtils.format(parent.getMessage("unknwon skeleton"), name));
          });

          var qObject = this.qObject;
          var qStage = qInstance.stage();
          for (var i=0; i<qObject.children.length; i++) {
            qObject.children[i].destroy();
          }
          var chest = null;
          var leftArm = null;
          var rightArm = null;
          var character = this;
          qInstance.load(assets,function() {
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
        }
    };
        
    Character.prototype._change = function(name) {
        if (typeof name !== 'undefined' && (typeof name === 'string' || name instanceof String)) {
          var simplifiedName = TUtils.removeAccents(name);
          this._loadSkeleton(this.getMessage(simplifiedName));
        }
    };
    
    Character.prototype._raiseLeftArm = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.leftElement.lower(value);
        }
    };

    Character.prototype._raiseRightArm = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.rightElement.raise(value);
        }
    };
    
    Character.prototype._lowerLeftArm = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.leftElement.raise(value);
        }
    };

    Character.prototype._lowerRightArm = function(value) {
        if (typeof value !== 'undefined' && !isNaN(value)) {
          this.rightElement.lower(value);
        }
    };

    TEnvironment.internationalize(Character);

    return Character;
});



