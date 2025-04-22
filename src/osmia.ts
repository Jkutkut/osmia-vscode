import {Result} from "./utils";

export const runOsmia = (code: string, context?: string): Result<string, string> => {
  const command = [
    'osmia',
    '--code-str',
    `'${code}'`
  ];
  if (context) {
    command.push('--ctx-str', `'${context}'`);
  }
  const fullCommand = command.join(' ');
  console.debug('Running command:', fullCommand);
  const { execSync } = require('child_process');
  try {
    const output = execSync(fullCommand, { encoding: 'utf8' });
    console.debug('Command output:', output);
    return { data: output };
  } catch (error: any) {
    console.error('Error executing command:', error.message);
    return { error: error.message };
  }
}
