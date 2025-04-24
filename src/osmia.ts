import {Result} from "./utils";

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function persistAsTmpFile(name: string, content: string): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.${date.getHours()}-${date.getMinutes()}`
  const tmpFilePath = path.join(os.tmpdir(), `${name}.${dateStr}.tmp`);
  fs.writeFileSync(tmpFilePath, content, { encoding: 'utf8' });
  return tmpFilePath;
}

export const runOsmia = (code: string, context: string | null): Result<string, string> => {
  const codeFile = persistAsTmpFile('code', code);
  const command = [
    'osmia',
    '--code', codeFile,
  ];
  if (context) {
    const contextFile = persistAsTmpFile('context', context);
    command.push('--ctx', contextFile);
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
    return { error: error.stderr };
  }
}
