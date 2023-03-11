import AbstractModLoader from './AbstractModLoader'

export const LATEST_MINECRAFT_RELEASE_VERSION = '1.19.3';

export type VanillaModLoaderNamespace = 'vanilla';

export default class VanillaModLoader extends AbstractModLoader {
  static NAMESPACE: VanillaModLoaderNamespace = 'vanilla';
}
