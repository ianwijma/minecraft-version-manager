import AbstractModLoader from './AbstractModLoader'

export type QuiltModLoaderNamespace = 'quilt';

export default class QuiltModLoader extends AbstractModLoader {
  static NAMESPACE: QuiltModLoaderNamespace = 'quilt';
}
