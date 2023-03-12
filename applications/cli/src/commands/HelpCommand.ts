import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { HelpText } from "../utils/HelpText";

export interface HelpCommandArguments extends AbstractCommandArguments {}

export class HelpCommand extends AbstractCommand<HelpCommandArguments> {
  handle(argv: HelpCommandArguments) {
    console.log(HelpText.getText())
  }

  getDescription(): string {
    return 'Displays this message';
  }
}
