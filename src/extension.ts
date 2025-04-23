import * as vscode from 'vscode';
import {getFileContent} from './input';
import {storeOutput} from './output';
import {runOsmia} from './osmia';

export function activate(context: vscode.ExtensionContext) {
  console.log('osmia is now active!');
  vscode.window.showInformationMessage('osmia is now active!');

  context.subscriptions.push(vscode.commands.registerTextEditorCommand('osmia.run', async (textEditor, edit) => {
    try {
      const osmiaContent = await getFileContent({
        extension: 'osmia',
        language: 'osmia'
      });
      if (osmiaContent.error) {
        vscode.window.showErrorMessage(`Error: ${osmiaContent.error}`);
        return;
      }

      const jsonContent = await getFileContent({
        extension: 'json',
        language: 'json',
        openLabel: 'Select context as JSON',
        canBeNull: true
      });
      if (jsonContent.error) {
        vscode.window.showErrorMessage(`Error: ${jsonContent.error}`);
        return;
      }

      console.debug('Osmia File Content:', osmiaContent.data);
      console.debug('JSON File Content:', jsonContent.data);

      const result = runOsmia(osmiaContent.data!, jsonContent.data!);
      if (result.error) {
        vscode.window.showErrorMessage(`Error: ${result.error}`);
        return;
      }
      await storeOutput(result.data!);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Error: ${err.message}`);
    }
  }));
}

export function deactivate() {
  vscode.window.showInformationMessage('osmia deactivated');
}
