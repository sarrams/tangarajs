define(['jquery','TEnvironment', 'objects/TGraphicalObject'], function($, TEnvironment, TGraphicalObject) {
    Character = function(characterName) {
        TGraphicalObject.call(this);
        
        var speed = 8;
        
        this.moveForward = function(value) {
            var element = this.getElement();
            $(element).animate({"left": "+="+value+"px"}, speed*value, 'linear');
            return;
        };

        this.moveBackward = function(value) {
            var element = this.getElement();
            $(element).animate({"left": "-="+value+"px"}, speed*value, 'linear');
            return;
        };
        
        this.moveUpward = function(value) {
            var element = this.getElement();
            $(element).animate({"top": "-="+value+"px"}, speed*value, 'linear');
            return;
        };

        this.moveDownward = function(value) {
            var element = this.getElement();
            $(element).animate({"top": "+="+value+"px"}, speed*value, 'linear');
            return;
        };
        
        this.stop = function() {
            var element = this.getElement();
            $(element).stop();
            return;
        }
        
        this.loadSkeleton = function(name) {
            var element = this.getElement();
            var baseUrl = TEnvironment.instance().getBaseUrl()+"/js/tangara/objects/ressources/character/"+name+"/";
            var skeletonUrl = baseUrl+"skeleton.json";
            $.getJSON(skeletonUrl, function(data) {
                $(element).empty();
                $.each( data['skeleton']['element'], function( key, val ) {
                    var image = document.createElement("img");
                    image.src = baseUrl+val['image'];
                    image.style.position="absolute";
                    image.style.left=val['coordinateX']+"px";
                    image.style.top=val['coordinateY']+"px";
                    element.appendChild(image);
                });
            }).fail(function( jqxhr, textStatus, error ) {
                throw "unknwon skeleton";
            });
        };
        
        this.change = function(name) {
            this.loadSkeleton(name);
        };

        if (typeof(characterName)==='undefined')
            characterName = "boy"
        
        this.loadSkeleton(characterName);
    };
    
    return Character;
});



