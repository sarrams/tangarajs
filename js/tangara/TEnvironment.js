define(['jquery','TCanvas','TRuntime', 'TLog'], function($, TCanvas, TRuntime, TLog) {
    var TEnvironment = function() {
        var canvas;
        var log;
        
        this.messages;
        
        this.language = "fr";

        this.load = function() {
            window.console.log("loading");
            var messageFile = this.getResource("messages.json");
            window.console.log("getting messages from: "+messageFile);
            var language = this.language;
            var parent = this;
            $.ajax({
                dataType: "json",
                url: messageFile,
                async: false,
                success: function(data) {
                    if (typeof data[language] !== 'undefined'){
                        parent.messages = data[language];
                        window.console.log("found messages in language: "+language);
                    } else {
                        window.console.log("found no messages for language: "+language);
                    }
                }
            });
        };

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

        this.getObjectsUrl = function() {
            return this.getBaseUrl()+"/js/tangara/objects";
        };
        
        this.getLanguage = function() {
            return this.language;
        };
        
        this.setLanguage = function(language) {
            this.language = language;
        };
        
        this.internationalize = function(initialClass) {
            var translationFile = initialClass.prototype.getResource("i18n.json");
            window.console.log("traduction : "+translationFile);
            var language = this.language;
            
            $.ajax({
                dataType: "json",
                url: translationFile,
                async: false,
                success: function(data) {
                    window.console.log("Language : "+language);
                    $.each(data[language]['methods'], function(key, val ) {
                        initialClass.prototype[val['translated']] = initialClass.prototype[val['name']];
                    });
                }
            });
            return initialClass;
        };
        
        this.getResource = function(location) {
            return this.getBaseUrl()+"/js/tangara/resources/"+location;
        };

        this.getMessage = function(code) {
            if (typeof this.messages[code] !== 'undefined') {
                return this.messages[code];
            } else {
                return "!message not defined!";
            }
        };

    }

    var environmentInstance = new TEnvironment();
    environmentInstance.load();

    return environmentInstance;//TEnvironment;
});


