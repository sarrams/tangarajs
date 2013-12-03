define(['jquery','TCanvas'], function($, TCanvas) {
    function TLog() {
        var domOuterLog = document.createElement("div");
        domOuterLog.style.width="100%";
        domOuterLog.style.height="10%";
        domOuterLog.style.backgroundColor="#C8C8C8";
        domOuterLog.style.overflow="scroll";
        var domLog = document.createElement("div");
        domLog.style.padding="5px";
        domOuterLog.appendChild(domLog);
                
        this.getElement = function() {
            return domOuterLog;
        };

        this.displayed = function() {
            return;
        };
        
        this.addLines = function(text, errorMessage) {
            var lines = text.split("\n");
            var success = (typeof(errorMessage) === 'undefined');
            for (var i=0; i<lines.length;i++) {
                line = lines[i];
                var row = document.createElement("div");
                if (success) {
                    row.className = "log log-success";
                } else {
                    row.className = "log log-failure";
                }
                row.appendChild(document.createTextNode(line));
                domLog.appendChild(row);
                domOuterLog.scrollTop = domOuterLog.scrollHeight;
            }
            if (!success) {
                var row = document.createElement("div");
                row.className = "log log-failure";
                row.appendChild(document.createTextNode(errorMessage));
                domLog.appendChild(row);
                domOuterLog.scrollTop = domOuterLog.scrollHeight;
            }
        };
        
        this.clear = function() {
            domLog.innerHTML = '';
        }

    } 
    
    return TLog;
});