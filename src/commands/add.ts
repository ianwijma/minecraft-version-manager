import { GluegunCommand, GluegunToolbox } from 'gluegun'
import ModDownload from '../Utilities/ModDownload'
import MvmPackageHandler, { DEFAULT_PACKAGE_NAME } from '../Utilities/MvmPackageHandler'
import { join } from 'path'

module.exports = {
  name: 'add',
  run: async (toolbox: GluegunToolbox) => {
    const { print: { success, error } } = toolbox;
    const { filesystem: { cwd } } = toolbox;
    const { parameters } = toolbox;
    const { string, options } = parameters;

    const { b: both = false, c: client = false, s: server = false } = options;

    const modDownloads = string.split(' ').map((part) => {
      const [ modName, modVersion = 'latest' ] = part.split('@');
      return new ModDownload(modName, modVersion);
    });

    const mvmPackage = MvmPackageHandler.loadMvmPackageFromDir(cwd());

    for (const modDownload of modDownloads) {
      if (both) { mvmPackage.addMod(modDownload) }
      else if (client) { mvmPackage.addClientMod(modDownload) }
      else if (server) { mvmPackage.addServerMod(modDownload) }
      else { mvmPackage.addMod(modDownload) }
    }

    const mvmPackageErrors = await mvmPackage.validate();
    if (mvmPackageErrors.length > 0) {
      error(`${DEFAULT_PACKAGE_NAME} has the following errors:\n${mvmPackageErrors.join('\n')}`);
    }

    await mvmPackage.getDownloader().process(join(mvmPackage._dir, 'mvm_modules', 'mods'));

    success('Mods added');
  }

} as GluegunCommand
