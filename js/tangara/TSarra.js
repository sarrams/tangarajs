define(['jquery'], function($) {
    function TSarra() {
        window.console.log("Sarra loading");
        
        this.simple = function() {
            console.log("méthode simple");
        };
        
        this.parametree = function(argument) {
            console.log("méthode avec ce paramètre : " + argument);
        };
    }
    
    return TSarra;
});
