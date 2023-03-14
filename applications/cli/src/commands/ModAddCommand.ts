import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { AbstractProvider, DirectProvider, InArrayError, ModProviders } from "@mvm/common";
import { ModCache } from "../../../../packages/common/src/FileCaches/ModCache";

export interface AddModCommandArguments extends AbstractCommandArguments {
  version: string,
  provider?: ModProviders,
  side: 'both' | 'server' | 'client'
}

export class ModAddCommand extends AbstractCommand<AddModCommandArguments> {
  async handle(argv: AddModCommandArguments) {
    const { _: [ modName ] } = argv;
    const { modProvider: defaultProvider = null, } = this.mvmPackage
    const { allModNames = [] } = this.mvmPackage
    const { mods = [], clientMods = [], serverMods = [] } = this.mvmPackage
    const { version = 'latest', provider = null, side = 'both' } = argv;
    const modProviderName = provider ?? defaultProvider;
    const cacheVersion = modProviderName === 'direct' ? 'latest' : version;

    InArrayError.validate(allModNames, modName);

    const knownFileHash = 'unknown'; // Create mvmPackageLock
    const inCache = await ModCache.inCache(modName, cacheVersion, knownFileHash);
    if (!inCache) {
      const modProvider = this.getProvider(modProviderName);
      const downloadPath = await modProvider.downloadOne(modName, version);

      const fileHash = await ModCache.toCache(modName, cacheVersion, downloadPath);
      console.log('Downloaded!~', fileHash);

      // TODO: Update lock file
    } else {
      console.log('Found!~', knownFileHash)

      // TODO: Update lock file
    }
  }

  private getProvider(provider: ModProviders): AbstractProvider {
    switch (provider) {
      case "direct":
        return new DirectProvider()
      case "github":
        return new DirectProvider()
      case "github-build":
        return new DirectProvider()
      case "curse-forge":
        return new DirectProvider()
      case "modrinth":
        return new DirectProvider()
    }
  }

  getDescription(): string {
    return 'Adds a mod'
  }

  getArguments(): string {
    return '<mod-name> [--version=string] [--provider=direct|github|github-build|curse-forge|modrinth]';
  }
}
