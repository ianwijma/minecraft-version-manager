import parser from 'yargs-parser';
import * as process from 'process';
import { CommandManager } from './utils/CommandManager'

async function Main(): Promise<void> {
  const { _: commandPath = [], ...argv } = parser(process.argv.slice(2));

  const [command, restPath] = CommandManager.getCommand(commandPath as string[]);

  if (command) {
    await command.initialize();
    await command.handle({ ...argv, _: restPath });
  }
}

Main().catch(err => {
  console.error(err);
  process.exit(1);
})
