define(['jquery','TEnvironment', 'objects/TGraphicalObject'], function($, TEnvironment, TGraphicalObject) {
    Character = function(characterName) {
        window.console.log("Initializing character");
        TGraphicalObject.call(this);
        window.console.log("Character initialized");
        this.speed = 8;
        if (typeof(characterName)==='undefined')
            characterName = "boy";
        this._loadSkeleton(characterName);
    };

    Character.prototype = new TGraphicalObject();

    Character.prototype.className = "Character";
        
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
        var element = this.getElement();
        var baseImageUrl = this.getResource(name)+"/";
        var skeletonUrl = baseImageUrl+"skeleton.json";
        window.console.log("Skeleton URL : "+skeletonUrl);
        $.getJSON(skeletonUrl, function(data) {
            $(element).empty();
            $.each( data['skeleton']['element'], function( key, val ) {
                var image = document.createElement("img");
                image.src = baseImageUrl+ val['image'];
                image.style.position="absolute";
                image.style.left=val['coordinateX']+"px";
                image.style.top=val['coordinateY']+"px";
                element.appendChild(image);
            });
        }).fail(function( jqxhr, textStatus, error ) {
            throw "unknwon skeleton";
        });
    };
        
    Character.prototype._change = function(name) {
        this.loadSkeleton(name);
    };
    
    TEnvironment.instance().internationalize(Character);

    return Character;
});



