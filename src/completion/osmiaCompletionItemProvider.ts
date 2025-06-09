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

  protected formatDump(
    variable: string,
    triggerChar: string,
    key: string,
    {type, value, description}: {type: string, value: string, description?: string}) {
    let descriptionString;
    if (description) {
      descriptionString = description;
    }
    else {
      switch (type) {
        case "variable":
          descriptionString = `${key} = ${value}`;
          break;
        default:
          descriptionString = `${type} ${variable}${triggerChar}${key}`;
      }
    }
    return this.newCompletion(
      key,
      this.processSnippet(key),
      descriptionString
    );
  }

  protected variable(document: vscode.TextDocument, position: vscode.Position) {
    const line = document.lineAt(position.line);
    let variableIdxEnd = position.character - 1;
    let variableValidIdxStart = variableIdxEnd;
    const depthArr = [];
    while (variableValidIdxStart >= 0) {
      const char = line.text[variableValidIdxStart];
      if ("]})".indexOf(char) >= 0) {
        switch (char) {
          case "}":
            depthArr.push("{");
            break;
          case "]":
            depthArr.push("[");
            break;
          case ")":
            depthArr.push("(");
            break;
        }
      }
      else if (depthArr.length > 0 && depthArr[depthArr.length - 1] === char) {
        depthArr.pop();
      }
      else if (depthArr.length == 0 && !this.isValidVariableChar(char)) {
        variableValidIdxStart++;
        break;
      }
      variableValidIdxStart--;
    }
    variableValidIdxStart = Math.max(0, variableValidIdxStart);
    if (variableValidIdxStart > variableIdxEnd) {
      return null;
    }
    return line.text.slice(variableValidIdxStart, variableIdxEnd + 1);
  }

  protected isValidVariableChar(char: string) {
    if (
      (char.toLowerCase() >= 'a' && char.toLowerCase() <= 'z') ||
      (char >= '0' && char <= '9')
    ) {
      return true;
    }
    if ("_.'\"".indexOf(char) >= 0) {
      return true;
    }
    return false;
  }
}
