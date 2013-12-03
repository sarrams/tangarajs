define(['jquery','TCanvas','TRuntime', 'TLog'], function($, TCanvas, TRuntime, TLog) {
    function TEnvironment() {
        var canvas;
        var log;

        this.setCanvas = function(element) {
            canvas = element;
            return;
        };

        this.setLog = function(element) {
            log = element;
            return;
        };


        this.getCanvas = function() {
            return canvas;
        };
        
        this.execute = function(command) {
            TRuntime.instance().execute(command);
        };
        
        this.addLog = function(text, success) {
            if (typeof log !== 'undefined') {
                log.addLines(text, success);
            }
        };
        
        this.clearLog = function() {
            if (typeof log !== 'undefined') {
                log.clear();
            }
        };
        
        this.getBaseUrl = function() {
            return window.location.protocol + "//" + window.location.host+ window.location.pathname.split("/").slice(0, -1).join("/");
        };

    }

    var environmentInstance = new TEnvironment();

    TEnvironment.instance = function() {
        return environmentInstance;
    };

    return TEnvironment;
});


