define(['jquery', 'TEnvironment'], function($, TEnvironment) {
    function TRuntime() {
        var libs = new Array();
        var translatedNames = new Array();
        
        this.load = function() {
            require(['TEnvironment'], function(TEnvironment) {
                var language = TEnvironment.instance().getLanguage();
                var objectsListUrl = TEnvironment.instance().getObjectsUrl()+"/objects.json";
                window.console.log("accessing objects list from: "+objectsListUrl);
                $.getJSON(objectsListUrl, function(data) {
                    $.each( data, function( key, val ) {
                        var lib = "objects/"+val['path']+"/"+key;
                        if (typeof val['translations'][language] !== 'undefined') {
                            window.console.log("adding "+lib);
                            libs.push(lib);
                            translatedNames.push(val['translations'][language]);
                        }
                    });
                });
                // declare global variables
                require(libs, function() {
                    for(var i= 0; i < translatedNames.length; i++) {
                        window[translatedNames[i]] = arguments[i];
                    }
                });
            });
        };
        
        this.execute = function(commands) {
            var error = false;
            var message;
            try {
                eval(commands);
            } catch (e) {
                error = true;
                message = e.message;
            }
            require(['TEnvironment'], function(TEnvironment) {
                if (error)
                    TEnvironment.instance().addLog(commands, message);
                else
                    TEnvironment.instance().addLog(commands);
            });
        };
    };
    
    var runtimeInstance = new TRuntime();
    runtimeInstance.load();

    TRuntime.instance = function() {
        return runtimeInstance;
    };
    
    return TRuntime;
});


