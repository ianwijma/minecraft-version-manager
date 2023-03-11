import AbstractModProvider from './AbstractModProvider'

export type CurseForgeModProviderNamespace = 'curseForge';

export default class CurseForgeModProvider extends AbstractModProvider {
  static NAMESPACE: CurseForgeModProviderNamespace = 'curseForge';
}
