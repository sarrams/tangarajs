define(['jquery','objects/Character'], function($, Character) {
   Personnage = function(characterName) {
       var traductions = {'fille':'girl', 'garçon':'boy', 'chien':'dog', 'chat':'cat'};
       
       if (typeof(characterName) === 'undefined')
           characterName = "boy";
       else if (typeof (traductions[characterName] !== 'undefined'))
           characterName = traductions[characterName]
       else
           characterName = "boy";
       Character.call(this,characterName);
       
       this.avancer = function(value) {
           return this.moveForward(value);
       };

       this.reculer = function(value) {
           return this.moveBackward(value);
       };

       this.monter = function(value) {
           return this.moveUpward(value);
       };

       this.descendre = function(value) {
           return this.moveDownward(value);
       };

       this.arreter = function() {
           return this.stop();
       };
       
       this.changer = function(value) {
           return this.change(traductions[value]);
       };

       this.supprimer = function() {
           return this.deleteObject();
       };

    };
    
    return Personnage;
});


