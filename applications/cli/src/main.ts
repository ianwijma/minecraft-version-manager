import parser from 'yargs-parser';
import * as process from 'process';
import CommandManager from './utils/CommandManager'

async function Main(): Promise<void> {
  const { _: commandPath = [], ...argv } = parser(process.argv.slice(2));

  const [command, restPath] = CommandManager.getCommand(commandPath as string[]);

  if (command) {
    command.handle({ ...argv, _: restPath });
  }
}

Main().catch(console.error);
