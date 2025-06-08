import * as vscode from 'vscode';
import { OsmiaCompletionItemProvider } from '.';

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
    switch (varType) {
      case 'string':
        return this.stringMethods();
      case 'int':
        return this.intMethods();
      case 'float':
        return this.floatMethods();
      case 'null':
        return this.nullMethods();
      case 'array':
        return this.arrayMethods();
      case 'object':
        return this.objectMethods();
      case null:
        return;
    }
  }

  protected genericMethods(): vscode.CompletionItem[] {
    return [
      this.newCompletion(
        'len',
        this.processSnippet('len()'),
        'Returns the length of the variable'
      ),
      this.newCompletion(
        'has_content',
        this.processSnippet('has_content()'),
        'Returns true if the variable has content'
      ),
      this.newCompletion(
        'to_bool',
        this.processSnippet('to_bool()'),
        'Converts the variable to a boolean'
      ),
      this.newCompletion(
        'to_float',
        this.processSnippet('to_float()'),
        'Converts the variable to a float'
      ),
      this.newCompletion(
        'to_int',
        this.processSnippet('to_int()'),
        'Converts the variable to an integer'
      ),
      this.newCompletion(
        'to_string',
        this.processSnippet('to_string()'),
        'Converts the variable to a string'
      ),
      this.newCompletion(
        'type',
        this.processSnippet('type()'),
        'Returns the variable type as a string'
      ),
      this.newCompletion(
        'switch',
        this.processSnippet(
          'switch(${1:case}, ${2:value}, ${3:case}, ${4:value}, ${5:...}, ${6:default})'
        ),
        'Map value based on cases'
      )
    ];
  }

  protected stringMethods(): vscode.CompletionItem[] {
    return this.genericMethods().concat([
      this.newCompletion(
        'lower',
        this.processSnippet('lower()'),
        'Returns the variable lowercase'
      ),
      this.newCompletion(
        'upper',
        this.processSnippet('upper()'),
        'Returns the variable uppercase'
      ),
      this.newCompletion(
        'trim',
        this.processSnippet('trim()'),
        'Returns the variable trimmed'
      ),
      this.newCompletion(
        'capitalize',
        this.processSnippet('capitalize()'),
        'Returns the variable capitalized'
      ),
      this.newCompletion(
        'starts_with',
        this.processSnippet('starts_with(${1:prefix})'),
        'Returns true if the variable starts with the prefix'
      ),
      this.newCompletion(
        'ends_with',
        this.processSnippet('ends_with(${1:suffix})'),
        'Returns true if the variable ends with the suffix'
      ),
      this.newCompletion(
        'ensure_starts_with',
        this.processSnippet('ensure_starts_with(${1:prefix})'),
        'Ensures the variable starts with the prefix'
      ),
      this.newCompletion(
        'ensure_ends_with',
        this.processSnippet('ensure_ends_with(${1:suffix})'),
        'Ensures the variable ends with the suffix'
      ),
      this.newCompletion(
        'index_of',
        this.processSnippet('index_of(${1:needle})'),
        'Returns the index of the needle in the variable'
      ),
      this.newCompletion(
        'last_index_of',
        this.processSnippet('last_index_of(${1:needle})'),
        'Returns the last index of the needle in the variable'
      ),
      this.newCompletion(
        'match',
        this.processSnippet('match(${1:regex})'),
        'Returns whether the variable matches the pattern'
      ),
      this.newCompletion(
        'replace',
        this.processSnippet('replace(${1:needle}, ${2:replacement})'),
        'Replaces the needle with the replacement'
      ),
      this.newCompletion(
        'replace_all',
        this.processSnippet('replace_all(${1:needle}, ${2:replacement})'),
        'Replaces all needles with the replacement'
      ),
      this.newCompletion(
        'split',
        this.processSnippet('split(${1:delimiter})'),
        'Splits the variable by the delimiter'
      ),
      this.newCompletion(
        'truncate',
        this.processSnippet('truncate(${1:limit})'),
        'Truncates the variable to the limit'
      )
    ]);
  }

  protected intMethods() {
    return this.genericMethods();
  }

  protected floatMethods() {
    return this.genericMethods();
  }

  protected booleanMethods() {
    return this.genericMethods().concat([
      this.newCompletion(
        'then',
        this.processSnippet('then(${1:value}, ${2:else})'),
        'Returns either value or else'
      ),
      this.newCompletion(
        'not',
        this.processSnippet('not()'),
        'Returns the opposite of the variable'
      ),
      this.newCompletion(
        'and',
        this.processSnippet('and(${1:value})'),
        'Returns true if both values are true'
      ),
      this.newCompletion(
        'or',
        this.processSnippet('or(${1:value})'),
        'Returns true if either value is true'
      ),
      this.newCompletion(
        'nand',
        this.processSnippet('nand(${1:value})'),
        'Returns true if both values are false'
      ),
      this.newCompletion(
        'nor',
        this.processSnippet('nor(${1:value})'),
        'Returns true if either value is false'
      ),
      this.newCompletion(
        'xor',
        this.processSnippet('xor(${1:value})'),
        'Returns true if only one value is true'
      ),
      this.newCompletion(
        'xnor',
        this.processSnippet('xnor(${1:value})'),
        'Returns true if only one value is false'
      )
    ]);
  }

  protected nullMethods() {
    return this.genericMethods();
  }

  protected arrayMethods() {
    return this.genericMethods().concat([
      this.newCompletion(
        'sort',
        this.processSnippet('sort()'),
        'Sorts the array'
      ),
      this.newCompletion(
        'sort_by',
        this.processSnippet('sort_by(${1:fn (a, b) => a - b})'),
        'Sorts the array by the sorting function'
      ),
      this.newCompletion(
        'map',
        this.processSnippet('map(${1:fn (a) => a * a})'),
        'Maps the array using the function'
      ),
      this.newCompletion(
        'for_each',
        this.processSnippet('for_each(${1:fn (a) => ...})'),
        'Iterates over the array using the function'
      ),
      this.newCompletion(
        'for_each_index',
        this.processSnippet('for_each_index(${1:fn (a, idx) => ...})'),
        'Iterates over the array using the function with the index'
      ),
      this.newCompletion(
        'reverse',
        this.processSnippet('reverse()'),
        'Reverses the array'
      ),
      this.newCompletion(
        'filter',
        this.processSnippet('filter(${1:fn (a) => true})'),
        'Filters the array using the function'
      ),
      this.newCompletion(
        'filter_index',
        this.processSnippet('filter_index(${1:fn (a, idx) => true})'),
        'Filters the array using the function with the index'
      ),
      this.newCompletion(
        'reduce',
        this.processSnippet('reduce(${1:fn (a, b) => a + b}, ${2:0})'),
        'Reduces the array using the function'
      ),
      this.newCompletion(
        'join',
        this.processSnippet('join(${1:", "})'),
        'Joins the array using the separator and ?to_string()'
      )
    ]);
  }

  protected objectMethods() {
    return this.genericMethods();
  }
}
