1. Node.js をインストール

https://nodejs.org/ja から LTSバージョン（例：18.x、20.x）をインストール

2. Email送信を可能にする為に、RESENDアカウントを作成
https://resend.com/login
API KEYを作成

2. 必要なライブラリのインストール

# フロントエンド（React）
cd client
npm install

# バックエンド（Node.js + Express）
cd ../server
npm install

3. .env を server ディレクトリに作成

# server/.env
RESEND_API_KEY=your_actual_api_key

※ Resendなどのメール送信サービスを使っている場合に必要です。

別ターミナルで2つ同時に起動してください：

# サーバー起動（ポート 5000）
cd server
node server.js

# クライアント起動（ポート 3000）
cd client
npm start

アプリ画面：http://localhost:3000
API利用方法は、../SEVER/README.mdを参照

利用方法
デフォルトパスワード
admin/admin


