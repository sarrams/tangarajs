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
        domEditorText.className = "teditor-text-inner";

        // for iOS to show keyboard
        // TODO: add this only for iOS devices
        domEditorText.setAttribute("contenteditable", "true");

        domEditorCellText.appendChild(domEditorText);
        domEditorContainer.appendChild(domEditorCellText);

        var buttonExecute = document.createElement("button");
        buttonExecute.className = "teditor-button";
        var imageExecute = document.createElement("img");
        imageExecute.src = TEnvironment.getBaseUrl() + "/images/play.png";
        imageExecute.className = "teditor-button-image";
        buttonExecute.appendChild(imageExecute);
        buttonExecute.appendChild(document.createTextNode(TEnvironment.getMessage('button-execute')));

        var buttonClear = document.createElement("button");
        buttonClear.className = "teditor-button";
        var imageClear = document.createElement("img");
        imageClear.src = TEnvironment.getBaseUrl() + "/images/clear.png";
        imageClear.className = "teditor-button-image";
        buttonClear.appendChild(imageClear);
        buttonClear.appendChild(document.createTextNode(TEnvironment.getMessage('button-clear')));

        domEditorCellButtons.appendChild(buttonExecute);
        var separator = document.createElement("div");
        separator.className = "teditor-button-separator";
        domEditorCellButtons.appendChild(separator);
        domEditorCellButtons.appendChild(buttonClear);

        domEditorContainer.appendChild(domEditorCellButtons);

        domEditor.appendChild(domEditorContainer);

        TEditor.editorId++;

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

            $(buttonExecute).click(function() {
                TEnvironment.execute(aceEditor.getSession().getValue());
                aceEditor.setValue("", -1);
            });

            $(buttonClear).click(function() {
                if (window.confirm(TEnvironment.getMessage('clear-confirm'))) {
                    TEnvironment.getCanvas().clear();
                    TEnvironment.clearLog();
                }
            });

            var nb_command = 0;
            var history = 0;
            var archives_command=[];
            var commandline_not_ended;
            var cursorPosition;

            aceEditor.commands.addCommand({
                name: 'myCommand',
                bindKey: {win: 'Return',  mac: 'Return'},
                    exec: function(editor) {
                        require(['TEnvironment'], function(TEnvironment) {
                            commandline = aceEditor.getSession().getValue();
                            TEnvironment.execute(commandline);
                            editor.setValue("", -1);
                            if (commandline.length > 0){
	                            archives_command.push($.trim(commandline));
	                            nb_command++;
	                            history = nb_command;
	                            command_not_ended ="";
                            }
                        });
                    },
                    readOnly: true // false if this command should not apply in readOnly mode
             });
			aceEditor.commands.addCommand({
                name: 'myCommand2',
                bindKey: {win: 'Up',  mac: 'Up'},
                    exec: function(editor) {
                        require(['TEnvironment'], function(TEnvironment) {
                            var commandline;
                            if (history == nb_command) {
                            	commandline_not_ended = aceEditor.getSession().getValue();
                            	cursorPosition = aceEditor.getCursorPositionScreen();
                           }
                            if (history > 0) {
                                history--;
                                commandline = archives_command[history];
                                aceEditor.getSession().setValue(commandline);
                                aceEditor.navigateLineEnd();
                            }
                        });
                    },
                    readOnly: true // false if this command should not apply in readOnly mode
             });
			aceEditor.commands.addCommand({
                name: 'myCommand3',
                bindKey: {win: 'Down',  mac: 'Down'},
                    exec: function(editor) {
                        require(['TEnvironment'], function(TEnvironment) {
                            var commandline;
							if (history < nb_command){
								history++;
								commandline = archives_command[history];
	                            aceEditor.getSession().setValue(commandline);
	                            aceEditor.navigateLineEnd();
							}
							if (history == nb_command){
								commandline = commandline_not_ended;
								aceEditor.getSession().setValue(commandline);
								aceEditor.moveCursorToPosition(cursorPosition);
							}
                        });
                    },
                    readOnly: true // false if this command should not apply in readOnly mode
             });
			 aceEditor.commands.addCommand({
                name: 'myCommand4',
                bindKey: {win: 'Escape',  mac: 'Escape'},
                    exec: function(editor) {
                        require(['TEnvironment'], function(TEnvironment) {
							var currentLine = aceEditor.getSession().getValue();
							if (history == nb_command) {
								if (commandline_not_ended != currentLine)
								{
									commandline = currentLine;
									cursorPosition = aceEditor.getCursorPositionScreen();
								}
							}
							else {
								history = nb_command;
								commandline = commandline_not_ended;
	                       	}
							aceEditor.getSession().setValue(commandline);
							aceEditor.moveCursorToPosition(cursorPosition);
                        });
                    },
                    readOnly: true // false if this command should not apply in readOnly mode
             });
        };
    };

    TEditor.editorId = 0;

    return TEditor;
});
