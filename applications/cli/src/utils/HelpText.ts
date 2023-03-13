import { COMMAND_ROOT, CommandManager, CommandStruct } from "./CommandManager";
import { Constants, PackageJson } from "@mvm/common";
import { AbstractCommand } from "../commands/AbstractCommand";

export class HelpText {
  private static getCommands(): string[][] {
    const commandStruct = CommandManager.getCommands();
    return this.formatCommand(commandStruct);
  }

  private static formatCommand(commandStruct: CommandStruct, commands: string[][] = [], path: string[] = []): string[][] {
    return Object.keys(commandStruct).reduce((commandData, commandKey) => {
      const commandOrCommandStruct = commandStruct[commandKey];
      if (commandOrCommandStruct instanceof AbstractCommand) {
        const commandArray = [Constants.COMMAND];
        if (path.length) commandArray.push(path.join(' ').trim());
        commandArray.push(commandKey === COMMAND_ROOT ? '' : commandKey);
        commandArray.push(commandOrCommandStruct.getArguments())

        commandData.push([
          commandArray.join(' ').trim(),
          commandOrCommandStruct.getDescription(),
        ])
      } else if (commandOrCommandStruct ) {
        const newPath = [...path, commandKey];
        this.formatCommand(commandOrCommandStruct, commandData, newPath);
      }

      return commandData;
    }, commands);
  }

  static getText (): string {
    return `${this.getHeader()}

${this.getContent()}

${this.getFooter()}`
  }

  private static getHeader (): string {
    return `${Constants.FULL_NAME} v${PackageJson.version}`.trim();
  }

  private static getContent (): string {

    const commands = this.getCommands();
    return commands.reduce((content, command) => {
      const [commandString, commandDescription] = command;
      const tabs = 6 - Math.floor(commandString.length / 8);

      return content + `\t${commandString}${'\t'.repeat(tabs)}${commandDescription}\n`;
    }, '').trimEnd()
  }

  private static getFooter (): string {
    return `${Constants.COMMAND} has unicorn powers!~`.trim();
  }
}
