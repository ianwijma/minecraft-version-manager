import AbstractModLoader from './AbstractModLoader'

export type ForgeModLoaderNamespace = 'forge';

export default class ForgeModLoader extends AbstractModLoader {
  static NAMESPACE: ForgeModLoaderNamespace = 'forge';
}
