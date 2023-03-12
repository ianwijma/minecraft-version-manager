export interface AbstractCommandArguments {
  _: string[]
}

export abstract class AbstractCommand<Arguments extends AbstractCommandArguments = AbstractCommandArguments> {
  abstract handle(argv: Arguments);

  get description(): string {
    return '';
  }

  get arguments(): string {
    return '';
  }
}
