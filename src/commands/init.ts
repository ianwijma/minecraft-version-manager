import { GluegunCommand, GluegunToolbox } from 'gluegun'
import MvmPackageHandler, { DEFAULT_PACKAGE_NAME } from '../Utilities/MvmPackageHandler'
import MvmPackage from '../Utilities/MvmPackage'
import { basename } from 'path';
import { LATEST_MINECRAFT_RELEASE_VERSION } from '../modLoaders/VanillaModLoader'

module.exports = {
  name: 'init',
  run: async (toolbox: GluegunToolbox) => {
    const { print: { info, error } } = toolbox;
    const { filesystem: { cwd, path, isDirectory, exists } } = toolbox;
    const { parameters } = toolbox;

    const { first: target = '' } = parameters;
    const fullPath = path(cwd(), target);

    if (!isDirectory(fullPath)) {
      error(`${fullPath} is not a directory`);
      return;
    }

    if (exists(path(fullPath, DEFAULT_PACKAGE_NAME))) {
      error(`A ${DEFAULT_PACKAGE_NAME} already exists at ${fullPath}`);
      return;
    }

    const mvmPackage = new MvmPackage();
    mvmPackage.name = basename(fullPath);
    mvmPackage.version = '1.0.0';
    mvmPackage.minecraftVersion = LATEST_MINECRAFT_RELEASE_VERSION;
    mvmPackage.modLoader = 'vanilla';
    mvmPackage.modLoaderVersion = LATEST_MINECRAFT_RELEASE_VERSION;
    mvmPackage.mods = {};
    mvmPackage.modProvider = 'directDownload';
    mvmPackage.files = 'config';

    MvmPackageHandler.saveMvmPackageToDir(fullPath, mvmPackage);

    info('minecraft-package.json created');
  }
} as GluegunCommand
