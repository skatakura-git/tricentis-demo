# 📘 Tricentis 航空券予約システム API 一覧

このドキュメントは、`server.js` に実装されている各種APIエンドポイントの一覧と使用例を記載しています。

---

## ✈️ 認証・ユーザ管理系

### 🔐 ユーザ登録
- **POST** `/api/signup`
- **説明**: 新しいユーザを登録します
- **リクエストボディ**:
```json
{
  "username": "sampleuser",
  "password": "password123",
  "name": "山田太郎",
  "address": "東京都",
  "age": 30,
  "email": "taro@example.com"
}
```

---

### 🔑 ログイン
- **POST** `/api/login`
- **説明**: ユーザIDとパスワードで認証します
- **リクエストボディ**:
```json
{
  "username": "sampleuser",
  "password": "password123"
}
```

---

### 📤 確認コード送信（2FA）
- **POST** `/api/send-verification`
- **説明**: 指定ユーザに対して確認コードを送信します
- **リクエストボディ**:
```json
{
  "username": "sampleuser",
  "code": "123456"
}
```

---

### ✅ 確認コード検証（2FA）
- **POST** `/api/verify-code`
- **説明**: コードの正当性を検証します
- **リクエストボディ**:
```json
{
  "username": "sampleuser",
  "code": "123456"
}
```

---

### 🔍 ユーザ情報取得
- **GET** `/api/user/:username`
- **説明**: ユーザ情報を取得します
- **例**:
```bash
curl http://localhost:5000/api/user/sampleuser
```

---

### ❌ ユーザ削除
- **DELETE** `/api/user/:username`
- **説明**: 指定されたユーザを削除します
- **例**:
```bash
curl -X DELETE http://localhost:5000/api/user/sampleuser
```

---

## 💸 価格系

### 💰 航空券価格取得
- **GET** `/api/pricing`
- **説明**: 出発地と到着地の価格を取得（または全件）
- **例①**: 区間指定
```bash
curl "http://localhost:5000/api/pricing?from=東京&to=大阪"
```

- **例②**: 全リスト取得
```bash
curl http://localhost:5000/api/pricing
```

---

## 🧾 予約系

### 📝 予約登録
- **POST** `/api/purchase`
- **説明**: 購入情報を登録します
- **リクエストボディ例**:
```json
{
  "name": "山田太郎",
  "departureAirport": "東京",
  "arrivalAirport": "大阪",
  "departureDate": "2025-04-01",
  "returnDate": "2025-04-05",
  "passengerCount": 2,
  "price": 12000,
  "address": "東京都",
  "age": 30,
  "cardNumber": "1234-5678-9012-3456"
}
```

---

### 🔎 予約情報取得
- **GET** `/api/purchase/:id`
- **説明**: 予約IDを元に購入情報を取得します
- **例**:
```bash
curl http://localhost:5000/api/purchase/abc12345
```

---



