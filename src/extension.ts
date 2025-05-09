import * as vscode from 'vscode';
import {getFileContent} from './input';
import {storeOutput} from './output';
import {runOsmiaAsWorker} from './osmia';
import {init as initSettings} from './init';

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

      const osmiaConfig = vscode.workspace.getConfiguration('osmia');
      const executionTimeout = osmiaConfig.get<boolean>('executionTimeout.enabled') ?
        osmiaConfig.get<number>('executionTimeout.time') :
        undefined;
      const osmiaCmd = osmiaConfig.get<string>('osmiaEngine.native') ?
        'native' :
        osmiaConfig.get<string>('osmiaEngine.osmiaCmd') ?? '';
      const cancelTimeout = osmiaConfig.get<number>('executionTimeout.warnTime');

      const cancelNotification: (onCancel: () => void) => void = (onCancel) => {
        let information = "Osmia executing...";
        if (executionTimeout) {
          information += ` (timeout: ${executionTimeout / 1000}s)`;
        }
        vscode.window.showInformationMessage<string>(information, 'Cancel')
          .then((selection) => {
            if (selection === 'Cancel') {
              onCancel();
            }
          });
      };

      const result = await runOsmiaAsWorker({
        code: osmiaContent.data!, ctx: jsonContent.data!,
        osmiaCmd, executionTimeout,
        cancelNotification, cancelTimeout
      });
      if (result.error) {
        vscode.window.showErrorMessage(`Error: ${result.error}`);
        return;
      }
      await storeOutput(result.data!);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Error: ${err.message}`);
    }
  }));
  initSettings();
}

export function deactivate() {
  vscode.window.showInformationMessage('osmia deactivated');
}
