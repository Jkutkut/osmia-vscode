import * as vscode from 'vscode';
import {initSettings} from './settings';
import commands from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log('osmia is now active!');
  vscode.window.showInformationMessage('osmia is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('osmia.run', commands.run));
  context.subscriptions.push(vscode.commands.registerCommand('osmia.runNoCtx', commands.runNoCtx));

  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    "osmia", new OsmiaStmtCompletionProvider(), "{"
  ));
  initSettings();
}

class OsmiaStmtCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ) {
    const STMT_START = '{{';
    const STMT_END = '}}';
    const currentLine = document.lineAt(position.line);
    let isStmtStart = false;
    for (let i = position.character - 1; i >= 0; i--) {
      if (currentLine.text[i] === '{') {
        isStmtStart = i >= 1 && currentLine.text.slice(i - 1, i + 1) === STMT_START;
        break;
      }
      else if (currentLine.text[i].toLowerCase() < 'a' || currentLine.text[i].toLowerCase() > 'z') {
        break;
      }
    }
    if (!isStmtStart) {
      return;
    }

    const processSnippet = (snippet: string) => {
      return new vscode.SnippetString(snippet);
    };
    const completionItems: vscode.CompletionItem[] = [];
    // expr
    // assign

    // print
    const printItem = new vscode.CompletionItem('print', vscode.CompletionItemKind.Snippet);
    printItem.insertText = processSnippet('print ${1:expr} ');
    printItem.detail = 'Print text to the standard output';
    completionItems.push(printItem);

    // comment
    const commentItem = new vscode.CompletionItem('comment', vscode.CompletionItemKind.Snippet);
    commentItem.insertText = processSnippet('# $1 ');
    commentItem.detail = 'Insert a comment';
    completionItems.push(commentItem);

    // if
    const ifSnippet = new vscode.CompletionItem('if', vscode.CompletionItemKind.Snippet);
    ifSnippet.insertText = processSnippet('if ${1:condition} }}\n\t$2\n{{fi');
    ifSnippet.detail = 'Insert an if statement';
    completionItems.push(ifSnippet);

    const ifElseSnippet = new vscode.CompletionItem('if-else', vscode.CompletionItemKind.Snippet);
    ifElseSnippet.insertText = processSnippet('if ${1:condition} }}\n\t$2\n{{else}}\n\t$3\n{{fi');
    ifElseSnippet.detail = 'Insert an if and else';
    completionItems.push(ifElseSnippet);

    const ifElseIfElseSnippet = new vscode.CompletionItem('if-else-if-else', vscode.CompletionItemKind.Snippet);
    ifElseIfElseSnippet.insertText = processSnippet('if ${1:condition} }}\n\t$2\n{{elseif ${3:condition} }}\n\t$4\n{{else}}\n\t$5\n{{fi');
    ifElseIfElseSnippet.detail = 'Insert an if, else if and else';
    completionItems.push(ifElseIfElseSnippet);

    // while
    const whileSnippet = new vscode.CompletionItem('while', vscode.CompletionItemKind.Snippet);
    whileSnippet.insertText = processSnippet('while ${1:condition} }}\n\t$2\n{{done');
    whileSnippet.detail = 'Insert a while statement';
    completionItems.push(whileSnippet);

    // for
    const forSnippet = new vscode.CompletionItem('for', vscode.CompletionItemKind.Snippet);
    forSnippet.insertText = processSnippet('for ${1:condition} }}\n\t$2\n{{done');
    forSnippet.detail = 'Insert a for statement';
    completionItems.push(forSnippet);

    // break
    const breakSnippet = new vscode.CompletionItem('break', vscode.CompletionItemKind.Snippet);
    breakSnippet.insertText = processSnippet('break');
    breakSnippet.detail = 'Insert a break statement';
    completionItems.push(breakSnippet);

    // continue
    const continueSnippet = new vscode.CompletionItem('continue', vscode.CompletionItemKind.Snippet);
    continueSnippet.insertText = processSnippet('continue');
    continueSnippet.detail = 'Insert a continue statement';
    completionItems.push(continueSnippet);

    // function
    const functionSnippet = new vscode.CompletionItem('fn', vscode.CompletionItemKind.Snippet);
    functionSnippet.insertText = processSnippet('fn ${1:name}; ${2:arguments} }}\n\t$3\n{{done');
    functionSnippet.detail = 'Insert a function';
    completionItems.push(functionSnippet);

    // return
    const returnSnippet = new vscode.CompletionItem('return', vscode.CompletionItemKind.Snippet);
    returnSnippet.insertText = processSnippet('return ${1:expr} ');
    returnSnippet.detail = 'Insert a return statement';
    completionItems.push(returnSnippet);

    return completionItems;
  }
}

export function deactivate() {
  vscode.window.showInformationMessage('osmia deactivated');
}
