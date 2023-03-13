import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { ModProviders } from "@mvm/common";

export interface AddModCommandArguments extends AbstractCommandArguments {
  version: string,
  provider?: ModProviders,
}

export class ModAddCommand extends AbstractCommand<AddModCommandArguments> {
  handle(argv: AddModCommandArguments) {
    console.log(argv);
  }

  getDescription(): string {
    return 'Adds a mod'
  }

  getArguments(): string {
    return '<mod-name> [--version=string] [--provider=direct|github|github-build|curse-forge|modrinth]';
  }
}
