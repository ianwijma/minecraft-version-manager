import AbstractModProvider from './AbstractModProvider'

export type ModrinthModProviderNamespace = 'modrinth';

export default class ModrinthModProvider extends AbstractModProvider {
  static NAMESPACE: ModrinthModProviderNamespace = 'modrinth';
}
