import AbstractModLoader from './AbstractModLoader'

export type FabricModLoaderNamespace = 'fabric';

export default class FabricModLoader extends AbstractModLoader {
  static NAMESPACE: FabricModLoaderNamespace = 'fabric';
}
