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
    });

    qInstance.TGraphicalObject.extend("CharacterPart", {
        init: function(props,defaultProps) {
            this._super(qInstance._extend({
                name:"",
                moveUp:true,
                initialized:false,
                rotationSpeed:0.025
            },props),defaultProps);
            this.add("tween");
        },
        startAnimation: function() {
            this.changeWay();
        },
        changeWay: function() {
            var p = this.p;
            if (p.name === "rightArm") {
                if (p.moveUp) {
                    this.animate({angle:p.angle+4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                } else {
                    this.animate({angle:p.angle-4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                }
            } else if (p.name === "leftArm") {
                if (p.moveUp) {
                    this.animate({angle:p.angle-4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                } else {
                    this.animate({angle:p.angle+4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                }
            } else if (p.name === "chest") {
                if (p.moveUp) {
                    this.animate({y:p.y-4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                } else {
                    this.animate({y:p.y+4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                }
            } else if (p.name === "tail") {
                if (p.moveUp) {
                    this.animate({angle:p.angle+4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                } else {
                    this.animate({angle:p.angle-4},1, qInstance.Easing.Linear, {callback:this.changeWay});
                }
            } 

            p.moveUp = !p.moveUp;
        },
        raise: function(value) {
          this.stop();
          var duration = Math.abs(value*this.p.rotationSpeed);
          this.animate({angle:this.p.angle + value},duration, qInstance.Easing.Linear, {callback:this.changeWay});
        },
        lower: function(value) {
          this.stop();
          var duration = Math.abs(value*this.p.rotationSpeed);
          this.animate({angle:this.p.angle - value},duration, qInstance.Easing.Linear, {callback:this.changeWay});          
        }
    });

    
    Character.prototype.qSprite = qInstance.Character;

    Character.prototype._moveForward = function(value) {
        this.qObject.p.destinationX+=value;
        return;
    };

    Character.prototype._moveBackward = function(value) {
        this.qObject.p.destinationX-=value;
        return;
    };
        
    Character.prototype._moveUpward = function(value) {
        this.qObject.p.destinationY-=value;
        return;
    };

    Character.prototype._moveDownward = function(value) {
        this.qObject.p.destinationY+=value;
        return;
    };
        
    Character.prototype._stop = function() {
        this.qObject.p.destinationX = this.qObject.p.x;
        this.qObject.p.destinationY = this.qObject.p.y;
        return;
    };
        
    Character.prototype._loadSkeleton = function(name) {
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
                if (val['name'] === 'leftArm' || val['name'] === 'leftLeg') {
                  character.leftElement = element;
                }
                if (val['name'] === 'rightArm' || val['name'] === 'rightLeg') {
                  character.rightElement = element;
                }
                element.startAnimation();
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
        
    Character.prototype._change = function(name) {
        var simplifiedName = TUtils.removeAccents(name);
        this._loadSkeleton(this.getMessage(simplifiedName));
    };
    
    Character.prototype._raiseLeftArm = function(value) {
        this.leftElement.lower(value);
    };

    Character.prototype._raiseRightArm = function(value) {
        this.rightElement.raise(value);      
    };
    
    Character.prototype._lowerLeftArm = function(value) {
        this.leftElement.raise(value);      
    };

    Character.prototype._lowerRightArm = function(value) {
        this.rightElement.lower(value);      
    };

    TEnvironment.internationalize(Character);

    return Character;
});



