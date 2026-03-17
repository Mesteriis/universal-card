const UC_LAZY_BUNDLE_FILES = Object.freeze({
  advanced: 'uc-lazy-advanced.js',
  editor: 'uc-lazy-editor.js',
  cardEditor: 'uc-lazy-card-editor.js',
  devtools: 'uc-lazy-devtools.js'
});

export type LazyBundleName = keyof typeof UC_LAZY_BUNDLE_FILES;

function normalizeBaseUrl(baseUrl: string) {
  if (!baseUrl) {
    return '/local/';
  }

  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function prefersFlatBundleLayout(baseUrl: string) {
  return baseUrl.includes('/hacsfiles/');
}

export function getLazyBundleFileName(bundleName: LazyBundleName) {
  const fileName = UC_LAZY_BUNDLE_FILES[bundleName];
  if (!fileName) {
    throw new Error(`Unknown lazy bundle: ${bundleName}`);
  }

  return fileName;
}

export function getLazyBundleRelativePaths(bundleName: LazyBundleName, baseUrl: string) {
  const fileName = getLazyBundleFileName(bundleName);

  if (prefersFlatBundleLayout(baseUrl)) {
    return [fileName, `lazy/${fileName}`];
  }

  return [`lazy/${fileName}`, fileName];
}

export function getLazyBundleImportUrls(bundleName: LazyBundleName, baseUrl: string) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  return getLazyBundleRelativePaths(bundleName, normalizedBaseUrl)
    .map((relPath) => `${normalizedBaseUrl}${relPath}`);
}
