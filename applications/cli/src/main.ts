import parser from 'yargs-parser';
import * as process from 'process';
import { CommandManager } from './utils/CommandManager'

let isVerbose = false

async function Main(): Promise<void> {
  const { _: commandPath = [], v, verbose, ...argv } = parser(process.argv.slice(2));
  isVerbose = v || verbose

  const [command, restPath] = CommandManager.getCommand(commandPath as string[]);

  if (command) {
    await command.initialize();
    await command.handle({ ...argv, _: restPath });
  }
}

Main().catch(err => {
  console.trace(isVerbose ? err : err.message)
  process.exit(1);
})
