import * as vscode from 'vscode';

export default class OsmiaCompletionItemProvider {
  protected processSnippet(snippet: string) {
    return new vscode.SnippetString(snippet);
  };

  protected newCompletion(label: string, snippet: vscode.SnippetString, detail: string) {
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
    item.insertText = snippet;
    item.detail = detail;
    return item;
  }
}
