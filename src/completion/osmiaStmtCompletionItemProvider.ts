import * as vscode from 'vscode';
import { OsmiaCompletionItemProvider } from '.';

export default class OsmiaStmtCompletionItemProvider
  extends OsmiaCompletionItemProvider
  implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    if (context.triggerKind !== vscode.CompletionTriggerKind.TriggerCharacter) {
      return;
    }
    const STMT_START = '{{';
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

    return [
      // exprt: as ctx
      // assign: as ctx
      this.newCompletion(
        'print',
        this.processSnippet('print ${1:expr} '),
        'Print text to the standard output'
      ),
      this.newCompletion(
        'comment',
        this.processSnippet('# $1 '),
        'Insert a comment'
      ),
      this.newCompletion(
        'if',
        this.processSnippet('if ${1:condition} }}\n\t$2\n{{fi'),
        'Insert an if statement'
      ),
      this.newCompletion(
        'if-else',
        this.processSnippet('if ${1:condition} }}\n\t$2\n{{else}}\n\t$3\n{{fi'),
        'Insert an if-else statement'
      ),
      this.newCompletion(
        'if-elsif-else',
        this.processSnippet(
          'if ${1:condition} }}\n\t$2\n{{elsif ${3:condition} }}\n\t$4\n{{else}}\n\t$5\n{{fi'
        ),
        'Insert an if-elsif-else statement'
      ),
      this.newCompletion(
        'while',
        this.processSnippet('while ${1:condition} }}\n\t$2\n{{done'),
        'Insert a while statement'
      ),
      this.newCompletion(
        'for',
        this.processSnippet('for ${1:condition} }}\n\t$2\n{{done'),
        'Insert a for statement'
      ),
      this.newCompletion(
        'break',
        this.processSnippet('break'),
        'Break the current loop'
      ),
      this.newCompletion(
        'continue',
        this.processSnippet('continue'),
        'Continue the current loop'
      ),
      this.newCompletion(
        'function',
        this.processSnippet('fn ${1:name} ${2:arguments} }}\n\t$3\n{{done'),
        'Insert a function'
      ),
      this.newCompletion(
        'return',
        this.processSnippet('return ${1:expr} '),
        'Insert a return statement'
      )
    ];
  }
}
