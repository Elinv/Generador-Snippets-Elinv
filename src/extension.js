const path = require("path");
const vscode = require("vscode");

function activate(context) {
	
   // obtener el texto seleccionado
   let config = vscode.workspace.getConfiguration("copyOnSelect");
   // funcion para ...
   function generateTextToCopy() {
      // generate text from selections
      let eol = vscode.window.activeTextEditor.document.eol == vscode.EndOfLine.LF ? '\n' : '\r\n';
      var text = vscode.window.activeTextEditor.selections.map(selection => vscode.window.activeTextEditor.document.getText(selection)).join(eol);
      if (config.get("trimStart", false)) {
         text = text.replace(/^\s+/, '');
      }
      if (config.get("trimEnd", true)) {
         text = text.replace(/\s+$/, '');
      }
      return text;
   }

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.gensnippetelinv', () => {
			const panel = vscode.window.createWebviewPanel(
				'gensnippetelinv',
				'Generador automático de snippets Elinv',
				vscode.ViewColumn.One,
				{
					// Enable scripts in the webview
					enableScripts: true
				}

			);
			try {			
			// Get path to script on disk
			const onDiskPathScript = vscode.Uri.file(
				path.join(context.extensionPath, 'js', 'codeVSC.js')
			);
			// And get the special URI to use with the webview
			const jsScriptSrc = onDiskPathScript.with({
				scheme: 'vscode-resource'
			});
			// Get path to css on disk
			const onDiskPathCSS = vscode.Uri.file(
				path.join(context.extensionPath, 'css', 'estiloElinvVSC.css')
			);
			// And get the special URI to use with the webview
			const cssSrc = onDiskPathCSS.with({
				scheme: 'vscode-resource'
			});
			// se obtiene texto seleccionado
			let textClipBoard = generateTextToCopy();
			// abrimos el panel webview
			panel.webview.html = getWebviewContent(cssSrc, jsScriptSrc, textClipBoard);
			} catch (error) {
				console.log(`Error: ${error}`)
			}				
		})
	);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function getWebviewContent(cssScr, jsScript, codigo) {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="stylesheet" type="text/css" href="${cssScr}">
	</head>
	
	<body>
		<form id="frmVSC">
			<label for="VSCname">Name Vsc Snippets</label>
			<input type="text" name="VSCname" id="VSCname" placeholder="Name VSC Snippets" value="" required="" />
			<label for="VSCscope">Scope Vsc Snippets</label>
			<input type="text" name="VSCscope" id="VSCscope" placeholder="Scope VSC Snippets" value="" required="" />
			<label for="VSCprefix">Prefix Vsc Snippets</label>
			<input type="text" name="VSCprefix" id="VSCprefix" placeholder="Prefix VSC Snippets" value="" required="" />
			<label for="VSCdescription">Description Vsc Snippets</label>
			<input type="text" name="VSCdescription" id="VSCdescription" placeholder="Description VSC Snippets" value=""
				required="" />
			<label for="VSCbody">Body Vsc Snippets</label>
			<textarea placeholder="Body VSC Snippets" rows="7" id="VSCbody" name="VSCbody" required="">${codigo}</textarea>
			<div class="centro">
				<input type="button" id="VSCBut" name="VSCBut" value="Construir" />   
				<input type="button" id="VSCReset" name="VSCReset" value="Reset" />
			</div>
			<hr>
			<div class="centro">
				<a href="https://www.bing.com/search?q=elinv" target="_blank">Elinv en Bing</a>
				<a href="https://www.google.com.ar/search?q=elinv" target="_blank">Elinv en Google</a>
				<a href="https://www.reverbnation.com/elinv" target="_blank">Elinv en Reverbnation</a>
				<a href="https://addons.mozilla.org/en-US/firefox/user/11613310/" target="_blank">Elinv en Firefox</a>
			</div>
			<hr>
			<label for="VSCinfo">Report area</label>
			<input type="text" name="VSCinfo" id="VSCinfo" placeholder="Zona de informes" class="elinv_info" value="" required="" />
	
		</form>
		<script src="${jsScript}" type="text/javascript"></script>
	</body>
	
	</html>
	`;
}
