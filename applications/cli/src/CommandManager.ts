import { AbstractCommand } from '@mvm/common'
import { InitCommand } from '@mvm/command-init'
import { MvmCommand } from '@mvm/command-mvm'
import { AddModCommand } from "../../../packages/command-mod-add/src/lib/AddModCommand";

const COMMAND_ROOT = '_'

interface CommandStruct {
  [key: string]: AbstractCommand|CommandStruct
}

export default class CommandManager {
  private static commandStructure: CommandStruct = {
    [COMMAND_ROOT]: new MvmCommand(),
    init: new InitCommand(),
    mod: {
      add: new AddModCommand()
    }
  }

  static getCommand(commandPath: string[]): [AbstractCommand|null, string[]|null] {
    return this.searchCommand(commandPath, this.commandStructure);
  }

  private static searchCommand(commandPath: string[], commandStructure: CommandStruct): [AbstractCommand|null, string[]|null] {
    const [currentPath = COMMAND_ROOT, ...restPath] = commandPath;

    if (currentPath in commandStructure) {
      const currentCommandOrStructure = commandStructure[currentPath];

      if (currentCommandOrStructure instanceof AbstractCommand) {
        return [currentCommandOrStructure, restPath];
      }

      return this.searchCommand(restPath, currentCommandOrStructure);
    }
  }
}
