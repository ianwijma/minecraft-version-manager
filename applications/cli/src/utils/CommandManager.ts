import { MvmCommand } from "../commands/MvmCommand";
import { InitCommand } from "../commands/InitCommand";
import { ModAddCommand } from "../commands/ModAddCommand";
import { AbstractCommand } from "../commands/AbstractCommand";
import { HelpCommand } from "../commands/HelpCommand";
import { FileAddCommand } from "../commands/FileAddCommand";
import { ModRemoveCommand } from "../commands/ModRemoveCommand";

export const COMMAND_ROOT = '_'

export interface CommandStruct {
  [key: string]: AbstractCommand|CommandStruct
}

export class CommandManager {
  private static commandStructure: CommandStruct = {
    [COMMAND_ROOT]: new MvmCommand(),
    help: new HelpCommand(),
    init: new InitCommand(),
    mod: {
      add: new ModAddCommand(),
      remove: new ModRemoveCommand(),
    },
    file: {
      add: new FileAddCommand()
    }
  }

  static getCommands(): CommandStruct {
    return this.commandStructure;
  }

  static getCommand(commandPath: string[]): [AbstractCommand|undefined, string[]|undefined]|[] {
    return this.searchCommand(commandPath, this.commandStructure);
  }

  private static searchCommand(commandPath: string[], commandStructure: CommandStruct): [AbstractCommand|undefined, string[]|undefined]|[] {
    const [currentPath = COMMAND_ROOT, ...restPath] = commandPath;

    if (currentPath in commandStructure) {
      const currentCommandOrStructure = commandStructure[currentPath];

      if (currentCommandOrStructure instanceof AbstractCommand) {
        return [currentCommandOrStructure, restPath];
      }

      if (currentCommandOrStructure) {
        return this.searchCommand(restPath, currentCommandOrStructure);
      }
    }

    return [];
  }
}
