define(['jquery', 'TEnvironment'], function($, TEnvironment) {
    function TRuntime() {
        var libs = ['objects/TGraphicalObject','objects/i18n/fr/Personnage'];
        this.execute = function(commands) {
            var error = false;
            var message;
            require(libs, function(TGraphicalObject,Personnage) {
                try {
                        eval(commands);
                } catch (e) {
                    error = true;
                    message = e.message;
                }
            });
            require(['TEnvironment'], function(TEnvironment) {
                if (error)
                    TEnvironment.instance().addLog(commands, message);
                else
                    TEnvironment.instance().addLog(commands);
            });
        };
    };
    
    var runtimeInstance = new TRuntime();

    TRuntime.instance = function() {
        return runtimeInstance;
    };
    
    return TRuntime;
});


