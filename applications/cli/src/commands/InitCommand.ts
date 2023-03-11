import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";

export interface InitCommandArguments extends AbstractCommandArguments {
  yes: boolean
}

export default class InitCommand extends AbstractCommand<InitCommandArguments> {
  handle(argv: InitCommandArguments) {

  }

}
