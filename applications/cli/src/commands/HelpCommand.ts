import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { HelpText } from "../utils/HelpText";

export interface HelpCommandArguments extends AbstractCommandArguments {}

export class HelpCommand extends AbstractCommand<HelpCommandArguments> {

  async initialize(): Promise<void> {
    // handle will do the initializing!~
  }

  handle(argv: HelpCommandArguments) {
    console.log(HelpText.getText())
  }

  getDescription(): string {
    return 'Displays this message';
  }
}
