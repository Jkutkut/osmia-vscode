import {Result} from "./utils";
import {run, run_json_ctx, run_yaml_ctx} from 'osmia-npm';

import { Worker } from 'worker_threads';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function persistAsTmpFile(name: string, content: string): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.${date.getHours()}-${date.getMinutes()}`;
  const tmpFilePath = path.join(os.tmpdir(), `${name}.${dateStr}.tmp`);
  fs.writeFileSync(tmpFilePath, content, { encoding: 'utf8' });
  return tmpFilePath;
}

export interface Ctx {
  type: 'json' | 'yaml';
  content: string;
}
export type OsmiaOutput = Result<string, string>;
export interface RunOsmiaOptions {
  code: string;
  ctx: Ctx | null;
};
export interface RunOsmiaCmdOptions extends RunOsmiaOptions {
  osmiaCmd: 'native' | string;
};
export interface OsmiaWorkerOptions extends RunOsmiaCmdOptions {};
export interface OsmiaWorkerProps extends OsmiaWorkerOptions {
  executionTimeout?: number;
  cancelNotification: (onCancel: () => void) => void;
  cancelTimeout?: number;
};

export const runOsmiaCmd = ({ osmiaCmd, code, ctx }: RunOsmiaCmdOptions): OsmiaOutput => {
  osmiaCmd = osmiaCmd === 'native' ? 'osmia' : osmiaCmd;
  const codeFile = persistAsTmpFile('code', code);
  const command = [
    osmiaCmd,
    '--code', codeFile,
  ];
  if (ctx) {
    switch (ctx.type) {
      case 'json':
        const contextFile = persistAsTmpFile('ctx', ctx.content);
        command.push('--ctx-json', contextFile);
        break;
      case 'yaml':
        const yamlContextFile = persistAsTmpFile('ctx', ctx.content);
        command.push('--ctx-yaml', yamlContextFile);
        break;
      default:
        return { error: `Unsupported context type: ${ctx.type}` };
    }
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

export const runOsmia = ({ code, ctx }: RunOsmiaOptions): OsmiaOutput => {
  console.debug("Running native osmia:\n", code);
  console.group("ctx:");
  console.debug(ctx);
  console.groupEnd();
  try {
    if (ctx) {
      switch (ctx.type) {
        case 'json':
          return { data: run_json_ctx(ctx.content, code) };
        case 'yaml':
          return { data: run_yaml_ctx(ctx.content, code) };
        default:
          return { error: `Unsupported context type: ${ctx.type}` };
      }
    } else {
      return { data: run(code) };
    }
  }
  catch (error: any) {
    console.error('Error executing native osmia:', error);
    return { error: `${error}` };
  }
};

export const runOsmiaAsWorker = (options: OsmiaWorkerProps): Promise<OsmiaOutput> => {
  const {
    executionTimeout,
    cancelTimeout,
    cancelNotification,
    ...osmiaOptions
  } = options;
  const cancelTimeoutNbr = cancelTimeout ?? 1000;
  const executionTimeoutNbr = executionTimeout ?? 20000;

  console.group();
  console.debug("cancelTimeoutNbr", cancelTimeoutNbr);
  console.debug("executionTimeoutNbr", executionTimeoutNbr);
  console.debug("options", osmiaOptions);
  console.groupEnd();

  const workerFile = path.join(__dirname, 'osmiaWorker.js');
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerFile);

    const executionTimeout = setTimeout(() => {
      worker.terminate();
      reject(new Error(`Execution timed out after ${options.executionTimeout}ms`));
    }, executionTimeoutNbr);
    const cancelNotificationTimeout = setTimeout(() => {
      cancelNotification(() => {
        endTimeouts();
        worker.terminate();
        reject(new Error('osmia execution cancelled'));
      });
    }, cancelTimeoutNbr);

    const endTimeouts = () => {
      clearTimeout(executionTimeout);
      clearTimeout(cancelNotificationTimeout);
    };

    worker.on('message', (response: OsmiaOutput) => {
      endTimeouts();
      console.debug('Worker response:', response);
      resolve(response);
    });
    worker.on('error', (error: any) => {
      endTimeouts();
      console.error('Worker error:', error);
      reject(new Error(error));
    });
    worker.on('exit', (code: number) => {
      endTimeouts();
      console.debug('Worker exit with code ', code);
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    worker.postMessage(osmiaOptions);
    console.debug('Worker started');
  });
};
