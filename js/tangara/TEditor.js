define(['jquery','ace/ace', 'TCanvas', 'TEnvironment'], function($,ace,TCanvas,TEnvironment) {

    function TEditor() {
        var domEditor = document.createElement("div");
        domEditor.className = "teditor";
        
        var domEditorContainer = document.createElement("div");
        domEditorContainer.className = "teditor-inner";
        
        var domEditorCellText = document.createElement("div");
        domEditorCellText.className = "teditor-text";
        
        var domEditorCellButtons = document.createElement("div");
        domEditorCellButtons.className = "teditor-buttons";
        
        var domEditorText = document.createElement("div");
	domEditorText.setAttribute("contenteditable","true");
        domEditorText.id = "teditor-text-"+TEditor.editorId;
        TEditor.editorId++;
        domEditorText.className = "teditor-text-inner";

        // for iOS to show keyboard
        domEditorText.setAttribute("contenteditable", "true");
        domEditorCellText.appendChild(domEditorText);
        domEditorContainer.appendChild(domEditorCellText);

        var buttonExecute = document.createElement("button");
        buttonExecute.className = "teditor-button";
        var imageExecute = document.createElement("img");
        imageExecute.src = TEnvironment.instance().getBaseUrl() + "/images/play.png";
        imageExecute.className = "teditor-button-image";
        buttonExecute.appendChild(imageExecute);
        buttonExecute.appendChild(document.createTextNode("Exécuter"));

        var buttonClear = document.createElement("button");
        buttonClear.className = "teditor-button";
        var imageClear = document.createElement("img");
        imageClear.src = TEnvironment.instance().getBaseUrl() + "/images/clear.png";
        imageClear.className = "teditor-button-image";
        buttonClear.appendChild(imageClear);
        buttonClear.appendChild(document.createTextNode("Effacer"));

        domEditorCellButtons.appendChild(buttonExecute);
        var separator = document.createElement("div");
        separator.className = "teditor-button-separator";
        domEditorCellButtons.appendChild(separator);
        domEditorCellButtons.appendChild(buttonClear);

        domEditorContainer.appendChild(domEditorCellButtons);
        
        domEditor.appendChild(domEditorContainer);
        
        var aceEditor;
        
        this.getElement = function() {
            return domEditor;
        };
        
        this.displayed = function() {
            aceEditor = ace.edit(domEditorText.id);
            aceEditor.getSession().setMode("ace/mode/java");
            aceEditor.setShowPrintMargin(false);
            aceEditor.renderer.setShowGutter(false); 
            aceEditor.setFontSize("20px");
            aceEditor.setHighlightActiveLine(false);
            aceEditor.focus();
            
            $("#buttonExecute").click(function() {
                TEnvironment.instance().execute(aceEditor.getSession().getValue());
                aceEditor.setValue("", -1);
            });
            
            $("#buttonClear").click(function() {
                if (window.confirm("Attention : vous allez effacer l'écran et l'historique\nSouhaitez-vous continuer ?")) {
                    TEnvironment.instance().getCanvas().clear();
                    TEnvironment.instance().clearLog();
                }
            });

            
            aceEditor.commands.addCommand({
                name: 'myCommand',
                bindKey: {win: 'Return',  mac: 'Return'},
                    exec: function(editor) {
                        require(['TEnvironment'], function(TEnvironment) {
                            TEnvironment.instance().execute(aceEditor.getSession().getValue());
                            editor.setValue("", -1);
                        });
                    },
                    readOnly: true // false if this command should not apply in readOnly mode
             });
        };
        
    };
    
    TEditor.editorId = 0;

    return TEditor;
});
