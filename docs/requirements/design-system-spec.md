# B-Hall デザインシステム仕様

## カラーパレット

### プライマリー
```
--primary-50:  #f0f4ff   背景の最淡色
--primary-100: #e0e8ff   ホバー背景
--primary-200: #c7d4fe   ボーダー
--primary-500: #6366f1   メインアクセント
--primary-600: #4f46e5   ボタン
--primary-700: #4338ca   ボタンホバー
```

### ニュートラル
```
--gray-50:  #fafafa    ページ背景
--gray-100: #f4f4f5    カード背景
--gray-200: #e4e4e7    ボーダー
--gray-400: #a1a1aa    プレースホルダー
--gray-500: #71717a    セカンダリテキスト
--gray-700: #3f3f46    テキスト
--gray-900: #18181b    見出し
```

### セマンティック
```
--success: #10b981     完了・成功
--warning: #f59e0b     注意・期限接近
--error:   #ef4444     エラー・期限超過・差戻し
--info:    #3b82f6     情報
```

## タイポグラフィ

```
フォント: Inter（英数字）, Noto Sans JP（日本語）
見出し1: 24px / font-bold / gray-900
見出し2: 20px / font-semibold / gray-900
見出し3: 16px / font-semibold / gray-700
本文:    14px / font-normal / gray-700
キャプション: 12px / font-normal / gray-500
```

## スペーシング

```
4px の倍数を基本単位とする
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

## 角丸

```
カード: 12px
ボタン: 8px
入力フィールド: 8px
バッジ: 999px（pill）
モーダル: 16px
```

## シャドウ

```
カード: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)
カードホバー: 0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)
モーダル: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
ドロップダウン: 0 4px 6px rgba(0,0,0,0.07)
```

## ガラス効果（Glassmorphism）

```css
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

サイドバー、モーダル背景、ドロップダウンに適用。

## コンポーネント一覧

### 基本
- Button（primary, secondary, ghost, danger）
- Input（text, number, date, select, textarea）
- Badge（ステータス、カウント）
- Avatar（ユーザーアイコン）
- Icon（Lucide Iconsを使用）

### 構造
- Card（情報カード）
- Section（セクション区切り）
- Sidebar（ナビゲーション）
- Header（ページヘッダー）
- Tabs（タブ切替）

### フィードバック
- Toast（トースト通知）
- Modal（モーダルダイアログ）
- Skeleton（ローディング）
- EmptyState（空状態）
- Alert（インラインアラート）

### データ表示
- StatusBadge（ステータスバッジ）
- Timeline（タイムライン）
- StatCard（数値カード）
- Chart（グラフ）
- KanbanBoard（カンバンボード）
