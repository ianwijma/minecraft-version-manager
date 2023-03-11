import { GluegunCommand, GluegunToolbox } from 'gluegun'
import MvmPackageHandler, { DEFAULT_PACKAGE_NAME } from '../Utilities/MvmPackageHandler'

module.exports = {
  name: 'validate',
  run: async (toolbox: GluegunToolbox) => {
    const { print: { success, error } } = toolbox;
    const { filesystem: { cwd } } = toolbox;

    const mvmPackage = MvmPackageHandler.loadMvmPackageFromDir(cwd());
    const mvmPackageErrors = await mvmPackage.validate();

    if (mvmPackageErrors.length > 0) {
      error(`${DEFAULT_PACKAGE_NAME} has the following errors:\n${mvmPackageErrors.join('\n')}`);
    } else {
      success(`${DEFAULT_PACKAGE_NAME} has been validated and no errors have been found.`)
    }
  }

} as GluegunCommand
