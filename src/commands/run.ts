import * as vscode from 'vscode';
import {getFileContent} from '../utils/input';
import {storeOutput} from '../utils/output';
import {Ctx, runOsmiaAsWorker} from '../osmia';
import {Result} from '../utils';

interface RunCommandOptions {
  requestCtx: boolean;
}

const runCommand = async ({
  requestCtx,
}: RunCommandOptions) => {
  try {
    const osmiaContent = await getFileContent({
      extension: 'osmia',
      language: 'osmia'
    });
    if (osmiaContent.error) {
      vscode.window.showErrorMessage(`Error: ${osmiaContent.error}`);
      return;
    }

    let ctx: Ctx | null = null;
    if (requestCtx) {
      const ctxContent = await getFileContent({
        extension: 'ctx',
        language: ['json', 'yaml'],
        openLabel: 'Select context',
        canBeNull: true
      });
      if (ctxContent.error) {
        vscode.window.showErrorMessage(`Error: ${ctxContent.error}`);
        return;
      }
      ctx = {
        type: ctxContent.data!.extension as 'json' | 'yaml',
        content: ctxContent.data!.data
      };
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
      code: osmiaContent.data!.data, ctx,
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
};

export const run = async () => {
  await runCommand({
    requestCtx: true
  });
};

export const runNoCtx = async () => {
  await runCommand({
    requestCtx: false
  });
};
