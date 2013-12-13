define(['jquery', 'TCanvas', 'TEnvironment', 'TEditor', 'TLog'], function($, TCanvas, TEnvironment, TEditor, TLog) {
    function TFrame() {
        var domFrame = document.createElement("div");
        domFrame.id = "tframe";
        
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
        TEnvironment.setCanvas(canvas);
        TEnvironment.setLog(log);

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
