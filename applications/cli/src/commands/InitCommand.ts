import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { Constants } from '@mvm/common';

export interface InitCommandArguments extends AbstractCommandArguments {
  yes: boolean
}

export class InitCommand extends AbstractCommand<InitCommandArguments> {
  handle(argv: InitCommandArguments) {
    console.log(argv)
  }

  getDescription(): string {
    return `Initializes ${Constants.COMMAND}`;
  }
}
