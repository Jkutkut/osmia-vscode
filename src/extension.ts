import * as vscode from 'vscode';
import {initSettings} from './settings';
import commands from './commands';
import {OsmiaStmtCompletionItemProvider} from './completion';

export function activate(context: vscode.ExtensionContext) {
  console.log('osmia is now active!');
  vscode.window.showInformationMessage('osmia is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('osmia.run', commands.run));
  context.subscriptions.push(vscode.commands.registerCommand('osmia.runNoCtx', commands.runNoCtx));

  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    "osmia", new OsmiaMethodCompletionItemProvider(), "?"
  ));
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    "osmia", new OsmiaStmtCompletionItemProvider(), "{"
  ));
  // TODO ctx
  initSettings();
}

export function deactivate() {
  vscode.window.showInformationMessage('osmia deactivated');
}
