import * as vscode from 'vscode';

const storeOutput = async (output: string) => {
  const doc = await vscode.workspace.openTextDocument({
    content: output,
    language: 'plaintext'
  });
  vscode.window.showTextDocument(doc);
};

/*
import * as fs from 'fs';
const storeOutput = async (output: string) => {
  const outputPath = path.join(path.dirname(osmiaFile[0].fsPath), 'combined_output.txt');
  fs.writeFileSync(outputPath, combined, 'utf8');
  vscode.window.showInformationMessage(`Combined file created at ${>outputPath}`);
};
*/

export { storeOutput };
