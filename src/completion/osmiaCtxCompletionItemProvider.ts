import * as vscode from 'vscode';
import { OsmiaCompletionItemProvider } from '.';
import {ctx_json_dump_variable, ctx_yaml_dump_variable} from 'osmia-npm';
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
    if (!variable) {
      return;
    }

    const alreadyOpenFile = getOpenFile(["json", "yaml"], ["json", "yaml"]);
    let ctx = null;
    let type = 'json';
    if (alreadyOpenFile.data) {
      ctx = alreadyOpenFile.data.file.getText();
      type = alreadyOpenFile.data.extension;
    }

    let dump: any;
    try {
      switch (type) {
        case "json":
          dump = JSON.parse(ctx_json_dump_variable(variable, ctx));
          break;
        case "yaml":
          dump = JSON.parse(ctx_yaml_dump_variable(variable, ctx));
          break;
        default:
          console.error("Unsupported context type for completions:", type);
          return [];
      }
      // dump = JSON.parse(ctx_json_dump_variable(variable, ctx));
      if (dump.type !== "object") {
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
