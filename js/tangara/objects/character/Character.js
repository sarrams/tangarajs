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
        var intialize = true;
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
                chestUp:true,
                chestShift:50,
                chestAmplitude:50,
                initialized:false
            },props),defaultProps);
            this.add("tween");
        },
        startAnimation: function() {
            this.changeWay();
        },
        changeWay: function() {
            var p = this.p;
            if (p.name === "rightArm") {
                if (p.chestUp) {
                    this.animate({angle:5},1, qInstance.Easing.Linear, {callback:this.changeWay});
                } else {
                    this.animate({angle:-5},1, qInstance.Easing.Linear, {callback:this.changeWay});
                }
            } else if (p.name === "leftArm") {
                if (p.chestUp) {
                    this.animate({angle:-5},1, qInstance.Easing.Linear, {callback:this.changeWay});
                } else {
                    this.animate({angle:5},1, qInstance.Easing.Linear, {callback:this.changeWay});
                }
            } else if (p.name === "chest") {
                if (p.chestUp) {
                    this.animate({y:p.y-5},1, qInstance.Easing.Linear, {callback:this.changeWay});
                } else {
                    this.animate({y:p.y+5},1, qInstance.Easing.Linear, {callback:this.changeWay});
                }
            }

            p.chestUp = !p.chestUp;
        },
        coucou: function() {
            window.alert("coucou");
        }
    /*        var p = this.p;
            if (p.name === "rightArm") {
                if (p.chestUp) {
                    this.matrix.rotate(p.chestShift);
                } else {
                    this.matrix.rotate(-p.chestShift);
                }
            } else if (p.name === "leftArm") {
                if (p.chestUp) {
                    this.matrix.rotate(1);
                } else {
                    this.matrix.rotate(-1);
                }
            } else if (p.name === "chest") {
                if (p.chestUp) {
                    this.matrix.translate(0,-1);
                } else {
                    this.matrix.translate(0,1);
                }
            } else if (p.name === "tail") {
                if (p.chestUp) {
                    this.matrix.rotate(1);
                } else {
                    this.matrix.rotate(-1);
                }
            }
            p.chestShift--;
            if (p.chestShift <= 0) {
                p.chestUp = !p.chestUp;
                p.chestDown = !p.chestDown;
                p.chestShift = p.chestAmplitude;
            }
        }*/
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
        window.console.log("load Skeleton");
        var baseImageUrl = this.getResource(name)+"/";
        
        /*var skeletonUrl = baseImageUrl+"boy.png";
        var qObject = this.qObject;
        QInstance.load(skeletonUrl,function() {
            qObject.asset(skeletonUrl, true);
            qObject.p.x = qObject.p.w/2;
            qObject.p.y = qObject.p.h/2;
            qObject.p.destinationX = qObject.p.w/2;
            qObject.p.destinationY = qObject.p.h/2;
        });*/
        var skeletonUrl = baseImageUrl+"skeleton.json";
        window.console.log("Skeleton URL : "+skeletonUrl);
        var parent = this;
        var elements = new Array();
        var points = new Array();
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
                $.each( data['skeleton']['point'], function( key, val ) {
                    points[val['name']] = val;
                });
            }
        }).fail(function(jqxhr, textStatus, error) {
            throw new Error(TUtils.format(parent.getMessage("unknwon skeleton"), name));
        });
        
        var qObject = this.qObject;
        var qStage = qInstance.stage();
        qInstance.load(assets,function() {
            for (var i=0; i<elements.length; i++) {
                var val = elements[i];
                var element = new qInstance.CharacterPart({asset:baseImageUrl+ val['image'], name:val['name']});
                element.p.x = element.p.w/2+parseInt(val['coordinateX']);
                element.p.y = element.p.h/2+parseInt(val['coordinateY']);
                // TODO : add center coordinates to elements element.p.cx = parseInt(val['coordinateY'])
                qStage.insert(element, qObject);
                element.startAnimation();
            }
            if (this.initialize) {
                qObject.p.x = qObject.p.w/2;
                qObject.p.y = qObject.p.h/2;
                qObject.p.destinationX = qObject.p.x;
                qObject.p.destinationY = qObject.p.y;
                this.initialize = false;
            }
        });
        
        /*
        $.getJSON(skeletonUrl, function(data) {
            $.each( data['skeleton']['element'], function( key, val ) {
                var element = new QInstance.Sprite({asset:baseImageUrl+ val['image'], cx:val['coordinateX'], cy:val['coordinateY']});
                QStage.insert(element, mainSprite);
                
            });
        }).fail(function(jqxhr, textStatus, error) {
            throw new Error(TUtils.format(parent.getMessage("unknwon skeleton"), name));
        });*/
        
        
        
        
        /*var mainSprite = this.getSprite();
        mainSprite.w = 200;
        mainSprite.h = 200;
        var baseImageUrl = this.getResource(name)+"/";
        var skeletonUrl = baseImageUrl+"skeleton.json";
        window.console.log("Skeleton URL : "+skeletonUrl);
        var parent = this;
        var QInstance = TEnvironment.getQuintusInstance(); 
        var QStage = QInstance.stage();
        $.getJSON(skeletonUrl, function(data) {
            $.each( data['skeleton']['element'], function( key, val ) {
                var element = new QInstance.Sprite({asset:baseImageUrl+ val['image'], cx:val['coordinateX'], cy:val['coordinateY']});
                QStage.insert(element, mainSprite);
                
            });
        }).fail(function(jqxhr, textStatus, error) {
            throw new Error(TUtils.format(parent.getMessage("unknwon skeleton"), name));
        });*/
    };
        
    Character.prototype._change = function(name) {
        var simplifiedName = TUtils.removeAccents(name);
        this._loadSkeleton(this.getMessage(simplifiedName));
    };
    
    TEnvironment.internationalize(Character);

    return Character;
});



