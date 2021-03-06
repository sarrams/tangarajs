define(['jquery','TEnvironment', 'TUtils', 'objects/TObject'], function($, TEnvironment, TUtils, TObject) {
    var Tangara = function() {
        window.console.log("Initializing tangara");
        TObject.call(this);
    };
    
    Tangara.prototype = new TObject();
    Tangara.prototype.className = "Tangara";

    Tangara.prototype._write = function(value) {
        if (typeof value === 'string') {
            TEnvironment.addLogMessage(value);
        }
    };

    Tangara.prototype._alert = function(value) {
        if (typeof value === 'string') {
            window.alert(value);
        }
    };

    Tangara.prototype._loadScript = function(name) {
        if (typeof name === 'string') {
            var scriptUrl = TEnvironment.getUserResource(name);
            var parent = this;
            $.ajax({
              dataType: "text",
              url: scriptUrl,
              async: false,
              success: function(data) {
                  TEnvironment.execute(data);
              }
          }).fail(function(jqxhr, textStatus, error) {
              throw new Error(TUtils.format(parent.getMessage("script unreachable"), name));
          });
        }
    };
    
    TEnvironment.internationalize(Tangara);
    
    var tangaraInstance = new Tangara();

    return tangaraInstance;
    //return Tangara;
});



