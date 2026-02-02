import * as vscode from 'vscode';
import * as fs from 'fs';
import {Option, Result} from '.';

const isValidDocument = (doc: vscode.TextDocument, extLang: string): boolean => {
  return doc.languageId === extLang || doc.uri.fsPath.endsWith(`.${extLang}`);
};

interface VscodeDocument {
  file: vscode.TextDocument;
  extension: string;
}

const getOpenFile: (extension: string | string[], language: string | string[]) => Option<VscodeDocument> = (extension, language) => {
  const extensions = Array.isArray(extension) ? extension : [extension];
  const languages = Array.isArray(language) ? language : [language];
  const openEditors = vscode.window.visibleTextEditors;
  const extLangs = [...extensions, ...languages];
  for (const editor of openEditors) {
    const document = editor.document;
    if (!document) {
      continue;
    }
    console.log('Document:', document.languageId, document);
    const ext = extLangs.find(e => isValidDocument(document, e));
    if (ext) {
      return {data: {
        file: document,
        extension: ext
      }};
    }
    // TODO check if something else can be done
  }
  return {};
};

interface FileContentProps {
  extension: string | string[];
  language: string | string[];
  openLabel?: string;
  canBeNull?: boolean;
}

interface File {
  data: string;
  extension: string;
}

const getFileContent: (args: FileContentProps) => Promise<Result<File | null, string>> = async ({
  extension,
  language,
  openLabel,
  canBeNull
}) => {
  openLabel = openLabel ?? `Select ${extension} file`;
  canBeNull = canBeNull ?? false;

  const extensions = Array.isArray(extension) ? extension : [extension];
  const languages = Array.isArray(language) ? language : [language];
  const alreadyOpenFile = getOpenFile(extensions, languages);
  if (alreadyOpenFile.data) {
    return { data: {
      data: alreadyOpenFile.data.file.getText(),
      extension: alreadyOpenFile.data.extension
    } };
  }

  if (canBeNull) {
    const confirmation = await vscode.window.showInformationMessage(
      `No ${extensions.join(', ')} file found. Do you want to open one?`,
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
    filters: { 'Osmia Files': [...extensions, '*'] },
    openLabel
  });
  if (!f) {
    return { error: 'No file selected' };
  }
  const content = fs.readFileSync(f[0].fsPath, 'utf8');
  if (!content || content.length === 0) {
    return { error: `A ${extension} file must be selected` };
  }
  const fileExtension = f[0].fsPath.split('.').pop() || '';
  return { data: {
    data: content,
    extension: fileExtension
  } };
};

export {
  getOpenFile,
  getFileContent
};
