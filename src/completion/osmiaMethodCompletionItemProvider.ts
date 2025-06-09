import * as vscode from 'vscode';
import { OsmiaCompletionItemProvider } from '.';
import {ctx_json_dump_variable} from 'osmia-npm';

export default class OsmiaMethodCompletionItemProvider
  extends OsmiaCompletionItemProvider
  implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    if (
      context.triggerKind !== vscode.CompletionTriggerKind.TriggerCharacter
    ) {
      return;
    }

    const variable = this.variable(document, position.translate(0, -1));
    if (!variable) return;
    const varType = this.variableType(variable);

    console.debug('variable:', variable, "type", varType);
    const completions = [];
    try {
      const methods = JSON.parse(ctx_json_dump_variable('_method.' + varType));
      for (const [key, value] of Object.entries<any>(methods.value)) {
        completions.push(this.formatDump(variable, "?", key, value));
      }
    }
    catch (e) {
      console.warn(e);
      return [];
    }
    return completions;
  }
}
