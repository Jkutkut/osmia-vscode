import * as vscode from 'vscode';
import { OsmiaCompletionItemProvider } from '.';
import {ctx_json_dump_variable} from 'osmia-npm';
import {getOpenFile} from '../utils/input';

export default class OsmiaCtxCompletionItemProvider
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
    const triggerChar = context.triggerCharacter;

    const varEndPos = triggerChar === "." ? position.translate(0, -1) : position;
    const variable = this.variable(document, varEndPos);
    if (!variable) return;

    const alreadyOpenFile = getOpenFile("json", "json");
    let ctx = null;
    if (alreadyOpenFile.data) {
      ctx = alreadyOpenFile.data.getText();
    }

    let dump: any;
    try {
      dump = JSON.parse(ctx_json_dump_variable(variable, ctx));
      if (dump.type != "object") {
        console.debug("dump is not an object, is:", dump.type);
        return [];
      }
      dump = dump.value;
    } catch (e) {
      console.warn(e);
      return [];
    }

    const completions = [];
    for (const [key, value] of Object.entries<any>(dump)) {
      completions.push(this.formatDump(variable, triggerChar!, key, value));
    }

    return completions;
  }
}
