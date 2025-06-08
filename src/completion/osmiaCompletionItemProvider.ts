import * as vscode from 'vscode';
import {run} from 'osmia-npm';

export default class OsmiaCompletionItemProvider {
  protected processSnippet(snippet: string) {
    return new vscode.SnippetString(snippet);
  }

  protected newCompletion(label: string, snippet: vscode.SnippetString, detail: string) {
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
    item.insertText = snippet;
    item.detail = detail;
    return item;
  }

  protected variableType(variable: string) {
    try {
      return run(`{{ ${variable}?type() }}`);
    } catch (_) {
      return null;
    }
  }

  protected variable(document: vscode.TextDocument, position: vscode.Position) {
    const line = document.lineAt(position.line);
    let variableIdxEnd = position.character - 1;
    let variableIdxStart = variableIdxEnd;
    const depthArr = [];
    while (variableIdxStart >= 0) {
      const char = line.text[variableIdxStart];
      if ("]}".indexOf(char) >= 0) {
        depthArr.push(char);
      }
      else if (depthArr.length > 0 && depthArr[depthArr.length - 1] === char) {
        depthArr.pop();
      }
      else if (
        depthArr.length === 0 &&
        !(char.toLowerCase() >= 'a' && char.toLowerCase() <= 'z') &&
        !(char >= '0' && char <= '9') &&
        !("_'\".".indexOf(char) >= 0)
      ) {
        break;
      }
      variableIdxStart--;
    }
    variableIdxStart = Math.max(0, variableIdxStart);
    if (variableIdxStart > variableIdxEnd) {
      return null;
    }
    return line.text.slice(variableIdxStart, variableIdxEnd + 1);
  }
}
