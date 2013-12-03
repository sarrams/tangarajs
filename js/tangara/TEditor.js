define(['jquery','ace/ace', 'TCanvas', 'TEnvironment'], function($,ace,TCanvas,TEnvironment) {

    function TEditor() {
        var domEditor = document.createElement("div");
        domEditor.style.width = "100%";
        domEditor.style.height= "20%";
        domEditor.style.backgroundColor="#C5D6DB";
        var domEditorContainer = document.createElement("div");
        domEditorContainer.style.display="table";
        domEditorContainer.style.height= "100%";
        domEditorContainer.style.width= "100%";
        
        var domEditorCellLeft = document.createElement("div");
        domEditorCellLeft.style.display="table-cell";
        domEditorCellLeft.style.width="80%";
        domEditorCellLeft.style.height="100%";
        domEditorCellLeft.style.padding="5px";
        var domEditorCellRight = document.createElement("div");
        domEditorCellRight.style.display="table-cell";
        domEditorCellRight.style.width="20%";
        domEditorCellRight.style.height="100%";
        domEditorCellRight.style.verticalAlign="middle";
        domEditorCellRight.style.textAlign="center";
        
        var domEditorText = document.createElement("div");
        domEditorText.id = "teditor_"+TEditor.editorId;
        domEditorText.style.width="100%";
        domEditorText.style.height="100%";
        domEditorText.style.backgroundColor="#C5D6DB";
        TEditor.editorId++;
        domEditorCellLeft.appendChild(domEditorText);
        domEditorContainer.appendChild(domEditorCellLeft);

        var buttonExecute = document.createElement("button");
        buttonExecute.id = "buttonExecute";
        buttonExecute.style.minWidth="100px";
        var imageExecute = document.createElement("img");
        imageExecute.src = TEnvironment.instance().getBaseUrl() + "/images/play.png";
        imageExecute.style.marginRight="5px";
        imageExecute.style.verticalAlign="text-bottom";
        buttonExecute.appendChild(imageExecute);
        buttonExecute.appendChild(document.createTextNode("Exécuter"));

        var buttonClear = document.createElement("button");
        buttonClear.id = "buttonClear";
        buttonClear.style.minWidth="100px";
        var imageClear = document.createElement("img");
        imageClear.src = TEnvironment.instance().getBaseUrl() + "/images/clear.png";
        imageClear.style.marginRight="5px";
        imageClear.style.verticalAlign="text-bottom";
        buttonClear.appendChild(imageClear);
        buttonClear.appendChild(document.createTextNode("Effacer"));

        domEditorCellRight.appendChild(buttonExecute);
        var separator = document.createElement("div");
        separator.style.width="100%";
        separator.style.height="10px";
        domEditorCellRight.appendChild(separator);
        domEditorCellRight.appendChild(buttonClear);

        domEditorContainer.appendChild(domEditorCellRight);
        
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