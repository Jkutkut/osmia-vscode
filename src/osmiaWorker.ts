import { parentPort } from 'worker_threads';
import {
  OsmiaWorkerOptions, RunOsmiaOptions, RunOsmiaCmdOptions,
  runOsmia, runOsmiaCmd,
  OsmiaOutput
} from './osmia';

if (!parentPort) throw new Error("Not running inside worker_threads");

parentPort.on('message', (task: OsmiaWorkerOptions) => {
  handleTask(task)
    .then((response) => {
      parentPort!.postMessage(response);
    })
    .catch((err) => {
      parentPort!.postMessage(err);
    });
});

async function handleTask(task: OsmiaWorkerOptions): Promise<OsmiaOutput> {
  console.debug("Received task:", task);
  if (task.osmiaCmd === 'native') {
    return runOsmia(task as RunOsmiaOptions);
  }
  return runOsmiaCmd(task as RunOsmiaCmdOptions);
}
