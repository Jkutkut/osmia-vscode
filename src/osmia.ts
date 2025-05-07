import {Result} from "./utils";
import {run, run_ctx} from 'osmia-npm';

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

export interface RunOsmiaOptions {
  code: string;
  context: string | null;
}

export interface RunOsmiaCmdOptions extends RunOsmiaOptions {
  osmiaCmd: string | null;
}

export const runOsmiaCmd = ({ osmiaCmd, code, context }: RunOsmiaCmdOptions): Result<string, string> => {
  osmiaCmd = osmiaCmd || 'osmia';
  const codeFile = persistAsTmpFile('code', code);
  const command = [
    osmiaCmd,
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
};

export const runOsmia = ({ code, context }: RunOsmiaOptions): Result<string, string> => {
  console.debug("Running native osmia:\n", code);
  console.group("context:");
  console.debug(context);
  console.groupEnd();
  try {
    if (context) {
      return { data: run_ctx(context, code) };
    } else {
      return { data: run(code) };
    }
  }
  catch (error: any) {
    console.error('Error executing command:', error.message);
    return { error: error.message };
  }
}
