define(['jquery', 'TCanvas', 'TEnvironment', 'TEditor', 'TLog'], function($, TCanvas, TEnvironment, TEditor, TLog) {
    function TFrame() {
        var domFrame = document.createElement("div");
        domFrame.style.height="100%";
        domFrame.style.width="100%";
        domFrame.style.minHeight="700px";
        
        // Add Canvas
        var canvas = new TCanvas();
        domFrame.appendChild(canvas.getElement());

        // Add Editor
        var editor = new TEditor();
        domFrame.appendChild(editor.getElement());

        // Add Log
        var log = new TLog();
        domFrame.appendChild(log.getElement());

        // Set environment
        env = TEnvironment.instance();
        env.setCanvas(canvas);
        env.setLog(log);

        this.getElement = function() {
            return domFrame;
        };
        
        this.displayed = function() {
            canvas.displayed();
            editor.displayed();
            log.displayed();
        };

    }
    
    return TFrame;
});
