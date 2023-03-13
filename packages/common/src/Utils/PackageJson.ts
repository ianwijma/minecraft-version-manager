import packageJson from '../../../../package.json';

export class PackageJson {
  static get version (): string {
    return packageJson.version;
  }

  // @ts-ignore this method conflicts with the build in `Function.name` method
  static get name (): string {
    return packageJson.name
  }
}
