define(['jquery'], function($) {
    function TRegis() {
        window.console.log("Regis loading");
        
        this.simple = function() {
            console.log("méthode simple");
        };
        
        this.parametree = function(argument) {
            console.log("méthode avec ce paramètre : " + argument);
        };
    }
    
    return TRegis;
});
