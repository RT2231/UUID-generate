# UUID Generator

UUID (Universally Unique Identifier) を簡単に生成・コピー・ダウンロードできる Web ツールです。

## 特徴

- **多様な UUID バージョン対応**: v1, v3, v4, v5, v6, v7, v8 をサポート
- **柔軟な出力形式**: 通常、ハイフンなし、大文字、小文字、JSON、CSV、改行区切り
- **一括操作**: 最大 1000 件までの UUID を一括生成・コピー・ダウンロード
- **ダークモード対応**: ライト/ダークモードを切り替え可能（設定は保存されます）
- **モバイル対応**: スマートフォンでも快適に操作できるレスポンシブデザイン
- **静的サイト**: サーバー不要で GitHub Pages や Cloudflare Pages にデプロイ可能

## デモ

[GitHub Pages デモリンク] (ここにデモ URL を記載)

## 対応 UUID バージョン

| バージョン | 説明 | 追加入力 |
| :--- | :--- | :--- |
| **v1** | タイムスタンプベース (MAC アドレス使用) | なし |
| **v3** | MD5 ハッシュベース | Namespace, Name |
| **v4** | ランダムベース (推奨) | なし |
| **v5** | SHA-1 ハッシュベース | Namespace, Name |
| **v6** | ソート可能なタイムスタンプベース | なし |
| **v7** | 新しいタイムスタンプベース (Unix エポック) | なし |
| **v8** | カスタム用途 | なし (またはカスタム入力) |

## インストールと実行

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### ローカル開発

```bash
# リポジトリのクローン
git clone <repository-url>
cd uuid-generator

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` (ポートは異なる場合があります) にアクセスしてください。

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルド結果の確認 (プレビュー)
npm run preview
```

`dist/` ディレクトリに静的ファイルが生成されます。

## 使用方法

1. **バージョン選択**: ドロップダウンから生成したい UUID のバージョンを選択します。
   - v3 と v5 を選択した場合は、Namespace と Name の入力欄が表示されます。
2. **生成数入力**: 1 から 1000 の間の数値を入力します。
3. **フォーマット選択**: 出力形式を選択します。
4. **Generate ボタンをクリック**: UUID が生成され、一覧表示されます。
5. **コピー**: 個別の UUID をコピーするか、「Copy All」で全てコピーできます。
6. **ダウンロード**: TXT, CSV, JSON 形式でファイルをダウンロードできます。

## 技術スタック

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UUID Library**: [uuid](https://github.com/uuidjs/uuid)
- **Styling**: CSS Modules (または Tailwind CSS / Styled Components など実装による)
- **Icons**: SVG または Icon Library

## プロジェクト構造

```
uuid-generator/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── GeneratorForm.tsx
│   │   ├── UuidList.tsx
│   │   ├── UuidItem.tsx
│   │   ├── Controls.tsx
│   │   └── Toast.tsx
│   ├── pages/
│   │   └── Home.tsx
│   ├── utils/
│   │   ├── uuidGenerator.ts
│   │   ├── formatters.ts
│   │   └── download.ts
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## デプロイ

### GitHub Pages

```bash
# ビルド
npm run build

# dist ディレクトリを gh-pages ブランチへプッシュ (例：gh-pages パッケージ使用)
npx gh-pages -d dist
```

リポジトリの設定で GitHub Pages のソースを `gh-pages` ブランチに設定してください。

### Cloudflare Pages

Cloudflare ダッシュボードからリポジトリを接続し、ビルドコマンド `npm run build`、ビルド出力ディレクトリ `dist` を設定してデプロイします。

### Cloudflare Workers (API 版)

API 機能を実装する場合は、`/api/uuid` エンドポイントを追加し、フロントエンドの `API_BASE` 設定を調整することで Workers 上で動作させることができます。

```typescript
// workers-example.ts のイメージ
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname === '/api/uuid') {
      // UUID 生成ロジック
      return new Response(JSON.stringify({ uuid: generateUuid() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // 静的ファイルの提供は Pages などに任せる想定
    return new Response('Not Found', { status: 404 });
  }
};
```

## 今後の拡張アイデア

- [ ] UUID 検証機能 (Validate)
- [ ] UUID 解析 (Version, Variant の表示)
- [ ] お気に入り UUID 保存
- [ ] 生成履歴機能
- [ ] PWA 対応 (オフライン利用)
- [ ] 多言語対応 (i18n)
- [ ] UUID 比較ツール

## ライセンス

MIT License

## 貢献

バグ報告や機能要望、プルリクエストは歓迎します。Issue を作成するか、プルリクエストを送信してください。

---

This tool is designed to be simple, fast, and useful for developers.
