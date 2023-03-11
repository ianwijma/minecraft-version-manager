import MvmPackage, { MvmPackageFileContent } from './MvmPackage'
import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export const DEFAULT_PACKAGE_NAME = 'mvm-package.json';

export default class MvmPackageHandler {
  static loadMvmPackageFromDir(dirPath: string): MvmPackage {
    if (!existsSync(dirPath)) throw new Error(`Directory not found: ${dirPath}`);
    if (!lstatSync(dirPath).isDirectory()) throw new Error(`${dirPath} is not a directory`);

    return this.loadMvmPackage(join(dirPath, DEFAULT_PACKAGE_NAME));
  }

  static loadMvmPackage(packagePath: string): MvmPackage {
    const mvmPackageContent = this.readMvmPackageContent(packagePath);
    const mvmPackage = new MvmPackage(packagePath, mvmPackageContent);
    return mvmPackage;
  }

  private static readMvmPackageContent(packagePath: string): MvmPackageFileContent {
    if (!existsSync(packagePath)) throw new Error(`${DEFAULT_PACKAGE_NAME} not found: ${packagePath}`);

    const content = readFileSync(packagePath, 'utf8');
    let mvmPackageContent: MvmPackageFileContent;
    try {
      mvmPackageContent = JSON.parse(content);
    } catch (e) {
      throw new Error(`${DEFAULT_PACKAGE_NAME} does not contain valid JSON format`);
    }

    return mvmPackageContent;
  }

  static saveMvmPackageToDir(dirPath: string, mvmPackage: MvmPackage) {
    if (!existsSync(dirPath)) throw new Error(`Directory not found: ${dirPath}`);
    if (!lstatSync(dirPath).isDirectory()) throw new Error(`${dirPath} is not a directory`);

    return this.saveMvmPackage(join(dirPath, DEFAULT_PACKAGE_NAME), mvmPackage);
  }
  static saveMvmPackage(packagePath: string, mvmPackage: MvmPackage): void {
    let currentPackageContent: MvmPackageFileContent = {};
    if (existsSync(packagePath)) currentPackageContent = this.readMvmPackageContent(packagePath);

    const newPackageContent = {...currentPackageContent, ...mvmPackage.toContent()};
    const content = JSON.stringify(newPackageContent, null, 4);
    writeFileSync(packagePath, content);
  }
}
