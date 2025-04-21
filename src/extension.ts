import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, "osmia" is now active!');
	vscode.window.showInformationMessage('Congratulations, osmia is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('osmia.run', async function () {
		vscode.window.showInformationMessage('Hello World from osmia!');
	}));
}
export function deactivate() {}
