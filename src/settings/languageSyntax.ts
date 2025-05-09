import * as vscode from 'vscode';

const setupLanguageSyntax = async () => {
  let shouldUpdateSettings = false;
  const config = vscode.workspace.getConfiguration('editor');
  const current = config.get<any>('tokenColorCustomizations') || {};

  const newRule = {
    "scope": "keyword.operator.osmia",
    "settings": {
      "foreground": "#808080"
    }
  };

  const textMateRules = current.textMateRules ?? [];
  const exists = textMateRules.some((rule: any) => rule.scope === newRule.scope);
  if (!exists) {
    textMateRules.push(newRule);
    shouldUpdateSettings = true;
  }

  if (shouldUpdateSettings) {
    console.debug('Updating settings...', "tokenColorCustomizations", textMateRules);
    await config.update(
      'tokenColorCustomizations',
      { textMateRules },
      vscode.ConfigurationTarget.Global
    );
  }
};

export default setupLanguageSyntax;
