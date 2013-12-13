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
        parent = this;
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
        }).fail(function(jqxhr, textStatus, error) {
            throw new Error(TUtils.format(parent.getMessage("unknwon skeleton"), name));
        });
    };
        
    Character.prototype._change = function(name) {
        var simplifiedName = TUtils.removeAccents(name);
        this._loadSkeleton(this.getMessage(simplifiedName));
    };
    
    TEnvironment.internationalize(Character);

    return Character;
});



