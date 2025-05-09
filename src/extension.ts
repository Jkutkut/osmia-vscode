import * as vscode from 'vscode';
import {init as initSettings} from './init';
import commands from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log('osmia is now active!');
  vscode.window.showInformationMessage('osmia is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('osmia.run', commands.run));
  initSettings();
}

export function deactivate() {
  vscode.window.showInformationMessage('osmia deactivated');
}
