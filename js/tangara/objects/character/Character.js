define(['jquery','TEnvironment', 'TUtils', 'objects/TGraphicalObject'], function($, TEnvironment, TUtils, TGraphicalObject) {
    var Character = function(characterName) {
        window.console.log("Initializing character");
        TGraphicalObject.call(this);
        window.console.log("Character initialized");
        this.speed = 8;
        if (typeof(characterName)==='undefined') {
            characterName = "boy";
        } else {
            var simplifiedName = TUtils.removeAccents(characterName);
            characterName = this.getMessage(simplifiedName);
        } 
            
        this._loadSkeleton(characterName);
    };

    Character.prototype = new TGraphicalObject();

    Character.prototype.className = "Character";
        
    var QInstance = TEnvironment.getQuintusInstance();
    QInstance.TGraphicalObject.extend("Character",{
        init: function(p) {
            this._super({w:20,h:20,asset:"http://localhost:8383/tangarajs/images/play.png"});
        }
    });
    
    Character.prototype.qSprite = QInstance.Character;

    Character.prototype._moveForward = function(value) {
        var element = this.getElement();
        $(element).animate({"left": "+="+value+"px"}, this.speed*value, 'linear');
        return;
    };

    Character.prototype._moveBackward = function(value) {
        var element = this.getElement();
        $(element).animate({"left": "-="+value+"px"}, this.speed*value, 'linear');
        return;
    };
        
    Character.prototype._moveUpward = function(value) {
        var element = this.getElement();
        $(element).animate({"top": "-="+value+"px"}, this.speed*value, 'linear');
        return;
    };

    Character.prototype._moveDownward = function(value) {
        var element = this.getElement();
        $(element).animate({"top": "+="+value+"px"}, this.speed*value, 'linear');
        return;
    };
        
    Character.prototype._stop = function() {
        var element = this.getElement();
        $(element).stop();
        return;
    };
        
    Character.prototype._loadSkeleton = function(name) {
        window.console.log("load Skeleton");
        
        Q.load("penguin.png",function() {
            var penguin = new Q.Penguin();

           Q.gameLoop(function(dt) {
           Q.clear();
     penguin.update(dt);
     penguin.render(Q.ctx);
   });
 });
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



