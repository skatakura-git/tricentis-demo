// server.js
import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
dotenv.config();
import { Resend } from 'resend';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// --- Lowdb セットアップ（pricingTable は db.json に委ねる） ---
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { users: [], purchases: [], pricingTable: {}, verificationCodes: [] });
await db.read();

if (!db.data) db.data = { users: [], purchases: [], pricingTable: {}, verificationCodes: [] };
if (!db.data.users) db.data.users = [];
if (!db.data.purchases) db.data.purchases = [];
if (!db.data.pricingTable) db.data.pricingTable = {};
if (!db.data.verificationCodes) db.data.verificationCodes = [];

await db.write();

// --- 確認コード送信API ---
app.post('/api/send-verification', async (req, res) => {
  const { username, code } = req.body;

  const recipients = [
    'qj7j9o39p2try9o0mlk64rgkv@tstmail.link'
  ];

  // コード保存
  db.data.verificationCodes = db.data.verificationCodes.filter(c => c.username !== username);
  db.data.verificationCodes.push({ username, code });
  await db.write();

  try {
    await Promise.all(recipients.map(to =>
      resend.emails.send({
        from: 'Tricentis <onboarding@resend.dev>',
        to,
        subject: '確認コード',
        html: `<p>確認コード: <strong>${code}</strong></p>`
      })
    ));

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'メール送信失敗' });
  }
});

// --- 確認コード検証API ---
app.post('/api/verify-code', (req, res) => {
  const { username, code } = req.body;
  const record = db.data.verificationCodes.find(v => v.username === username && v.code === code);
  if (record) {
    db.data.verificationCodes = db.data.verificationCodes.filter(v => v.username !== username);
    db.write();
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: '確認コードが一致しません' });
  }
});

// --- ログインAPI（ユーザDBに基づく） ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// --- 新規登録API ---
app.post('/api/signup', (req, res) => {
  const { username, password, name, address, age, email } = req.body;
  if (!username || !password || !name || !address || !age || !email) {
    return res.status(400).json({ success: false, message: 'すべての項目を入力してください' });
  }

  const existing = db.data.users.find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ success: false, message: 'このユーザIDはすでに使用されています' });
  }

  db.data.users.push({ username, password, name, address, age, email });
  db.write();
  res.json({ success: true });
});

// --- 金額取得API ---
app.get('/api/pricing', (req, res) => {
  const { from, to } = req.query;
  const pricingTable = db.data.pricingTable;

  if (!pricingTable) {
    return res.status(500).json({ error: '価格テーブルが見つかりません' });
  }

  if (!from && !to) {
    return res.json(pricingTable);
  }

  if (!from || !to) {
    return res.status(400).json({ error: '出発地と到着地を指定してください' });
  }

  const price = pricingTable[from]?.[to];

  if (price !== undefined) {
    res.json({ price });
  } else {
    res.status(404).json({ error: '指定された区間の料金は見つかりません' });
  }
});

// --- 購入登録API ---
app.post('/api/purchase', async (req, res) => {
  const purchase = req.body;
  const reservationId = nanoid(8);
  const newEntry = { id: reservationId, ...purchase };

  db.data.purchases.push(newEntry);
  await db.write();

  res.json({ success: true, reservationId });
});

// --- 購入情報取得API ---
app.get('/api/purchase/:id', async (req, res) => {
  const { id } = req.params;
  const record = db.data.purchases.find(p => p.id === id);

  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ error: '予約が見つかりません' });
  }
});

// --- ユーザ情報取得API ---
app.get('/api/user/:username', (req, res) => {
  const { username } = req.params;
  const user = db.data.users.find(u => u.username === username);
  if (user) {
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } else {
    res.status(404).json({ error: 'ユーザが見つかりません' });
  }
});

// --- ユーザ削除API ---
app.delete('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const existingUser = db.data.users.find(u => u.username === username);

  if (!existingUser) {
    return res.status(404).json({ success: false, message: 'ユーザが見つかりません' });
  }

  db.data.users = db.data.users.filter(u => u.username !== username);
  await db.write();
  res.json({ success: true, message: 'ユーザを削除しました' });
});

// --- サーバー起動 ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
