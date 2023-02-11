import AbstractModProvider from './AbstractModProvider'

export type DirectDownloadModProviderNamespace = 'directDownload';

export default class DirectDownloadModProvider extends AbstractModProvider {
  static NAMESPACE: DirectDownloadModProviderNamespace = 'directDownload';
}
