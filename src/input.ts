import * as vscode from 'vscode';
import * as fs from 'fs';
import {Result, Option} from "./utils";

interface FileContentProps {
  extension: string;
  language: string;
  openLabel?: string;
}

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

const getFileContent: (args: FileContentProps) => Promise<Result<string, string>> = async ({
  extension,
  language,
  openLabel
}) => {
  openLabel = openLabel ?? `Select ${extension} file`;

  const alreadyOpenFile = getOpenFile(extension, language);
  if (alreadyOpenFile.data) {
    return { data: alreadyOpenFile.data.getText() };
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
    return { error: 'File is empty' };
  }
  return { data: content };
};

export { getFileContent };
