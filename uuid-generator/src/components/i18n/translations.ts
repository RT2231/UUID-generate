export type Language = 'ja' | 'en';

export interface Translation {
  title: string;
  version: string;
  count: string;
  format: string;
  generate: string;
  copyAll: string;
  download: string;
  outputType: string;
  namespace: string;
  name: string;
  customData: string;
  uuidList: string;
  copiedToClipboard: string;
  failedToCopy: string;
  downloaded: string;
  countError: string;
  namespaceRequired: string;
  selectPreset: string;
  formats: {
    normal: string;
    noHyphen: string;
    uppercase: string;
    lowercase: string;
  };
  outputTypes: {
    newline: string;
    csv: string;
    json: string;
  };
  versions: {
    v1: string;
    v3: string;
    v4: string;
    v5: string;
    v6: string;
    v7: string;
    v8: string;
  };
  namespaces: {
    dns: string;
    url: string;
    oid: string;
    x500: string;
    custom: string;
  };
}

export const translations: Record<Language, Translation> = {
  ja: {
    title: 'UUID Generator',
    version: 'バージョン',
    count: '生成数',
    format: 'フォーマット',
    generate: '生成',
    copyAll: '📋 すべてコピー',
    download: 'ダウンロード ▼',
    outputType: '出力形式',
    namespace: '名前空間',
    name: '名前',
    customData: 'カスタムデータ (32 桁の 16 進数)',
    uuidList: 'UUID 一覧',
    copiedToClipboard: '✓ クリップボードにコピーしました',
    failedToCopy: '✗ コピーに失敗しました',
    downloaded: '✓ ダウンロードしました',
    countError: '生成数は 1〜1000 の範囲で入力してください',
    namespaceRequired: 'UUID v3/v5 には名前空間と名前の入力が必要です',
    selectPreset: 'プリセットを選択...',
    formats: {
      normal: '通常（ハイフンあり）',
      noHyphen: 'ハイフンなし',
      uppercase: '大文字',
      lowercase: '小文字',
    },
    outputTypes: {
      newline: '改行区切り',
      csv: 'CSV',
      json: 'JSON',
    },
    versions: {
      v1: 'v1 (タイムスタンプベース)',
      v3: 'v3 (名前ベース MD5)',
      v4: 'v4 (ランダム)',
      v5: 'v5 (名前ベース SHA-1)',
      v6: 'v6 (順序付きタイムスタンプ)',
      v7: 'v7 (Unix タイムスタンプ)',
      v8: 'v8 (カスタム)',
    },
    namespaces: {
      dns: 'DNS',
      url: 'URL',
      oid: 'OID',
      x500: 'X.500 DN',
      custom: 'カスタム...',
    },
  },
  en: {
    title: 'UUID Generator',
    version: 'Version',
    count: 'Count',
    format: 'Format',
    generate: 'Generate',
    copyAll: '📋 Copy All',
    download: 'Download ▼',
    outputType: 'Output Type',
    namespace: 'Namespace',
    name: 'Name',
    customData: 'Custom Data (32 hex chars)',
    uuidList: 'UUID List',
    copiedToClipboard: '✓ Copied to clipboard',
    failedToCopy: '✗ Failed to copy',
    downloaded: '✓ Downloaded',
    countError: 'Count must be between 1 and 1000',
    namespaceRequired: 'Namespace and Name are required for UUID v3/v5',
    selectPreset: 'Select preset...',
    formats: {
      normal: 'Normal (with hyphens)',
      noHyphen: 'No hyphens',
      uppercase: 'Uppercase',
      lowercase: 'Lowercase',
    },
    outputTypes: {
      newline: 'Newline separated',
      csv: 'CSV',
      json: 'JSON',
    },
    versions: {
      v1: 'v1 (Time-based)',
      v3: 'v3 (Name-based MD5)',
      v4: 'v4 (Random)',
      v5: 'v5 (Name-based SHA-1)',
      v6: 'v6 (Ordered time-based)',
      v7: 'v7 (Unix timestamp)',
      v8: 'v8 (Custom)',
    },
    namespaces: {
      dns: 'DNS',
      url: 'URL',
      oid: 'OID',
      x500: 'X.500 DN',
      custom: 'Custom...',
    },
  },
};
