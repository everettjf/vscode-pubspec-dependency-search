// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import PubspecCodeLensProvider from './provider';

const key = 'search.baseUrl';
var baseUrl: string = vscode.workspace.getConfiguration().get(key);
if (null == baseUrl || baseUrl.trim().length < 1) {
	baseUrl = "https://pub.dartlang.org/";
}

function startSearch(packageName: string) {
	// https://pub.dartlang.org/packages?q=path
	var tempUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
	let searchUrl = tempUrl + 'packages?q=' + encodeURI(packageName);
	vscode.env.openExternal(vscode.Uri.parse(searchUrl));
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider('yaml', new PubspecCodeLensProvider())
	);

	let commandSearch = vscode.commands.registerTextEditorCommand('extension.pubspecDependencySearchWithParameter',
		async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, packageName: string) => {
			startSearch(packageName);
		}
	);
	context.subscriptions.push(commandSearch);

	let commandInput = vscode.commands.registerCommand('extension.pubspecDependencySearch', () => {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInputBox().then(text => {
			if (text === undefined || text === '') {
				console.log('no input');
				return;
			}
			console.log('input : ' + text);
			startSearch(text);
		});
	});
	context.subscriptions.push(commandInput);
}

// this method is called when your extension is deactivated
export function deactivate() { }
