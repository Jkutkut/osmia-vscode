import * as vscode from 'vscode';
import * as fs from 'fs';
import {Result, Option} from "./utils";

const getOpenFile: (extension: string, language: string) => Option<vscode.TextDocument> = (extension, language) => {
  const openEditors = vscode.window.visibleTextEditors;
  for (const editor of openEditors) {
    const document = editor.document;
    if (!document) continue;
    console.log('Document:', document.languageId, document);
    if (
      document.languageId === extension ||
      document.languageId === language ||
      document.uri?.fsPath.endsWith(`.${extension}`) ||
      document.uri?.fsPath.endsWith(`.${language}`)
    ) {
      return {data: document};
    }
    // TODO check if something else can be done
  }
  return {};
};

interface FileContentProps {
  extension: string;
  language: string;
  openLabel?: string;
  canBeNull?: boolean;
}

const getFileContent: (args: FileContentProps) => Promise<Result<string | null, string>> = async ({
  extension,
  language,
  openLabel,
  canBeNull
}) => {
  openLabel = openLabel ?? `Select ${extension} file`;
  canBeNull = canBeNull ?? false;

  const alreadyOpenFile = getOpenFile(extension, language);
  if (alreadyOpenFile.data) {
    return { data: alreadyOpenFile.data.getText() };
  }

  if (canBeNull) {
    const confirmation = await vscode.window.showInformationMessage(
      `No ${extension} file found. Do you want to open one?`,
      'Yes',
      'No'
    );
    console.debug('Confirmation:', confirmation);
    if (confirmation === 'No') {
      return { data: null };
    }
  }

  const f = await vscode.window.showOpenDialog({
    canSelectMany: false,
    filters: { 'Osmia Files': [extension, '*'] },
    openLabel
  });
  if (!f) {
    return { error: 'No file selected' };
  }
  const content = fs.readFileSync(f[0].fsPath, 'utf8');
  if (!content || content.length === 0) {
    return { error: `A ${extension} file must be selected` };
  }
  return { data: content };
};

export { getFileContent };
