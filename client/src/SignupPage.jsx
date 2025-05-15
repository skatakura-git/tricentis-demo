import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    address: '',
    age: '',
    email: ''
  });
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignupStep1 = async () => {
    const { username, password, name, address, age, email } = form;
    if (!username || !password || !name || !address || !age || !email) {
      setMessage('すべての項目を入力してください');
      return;
    }
    const verificationCode = generateCode();
    setCode(verificationCode);
    try {
      const res = await axios.post('http://localhost:5000/api/send-verification', {
        username,
        code: verificationCode
      });
      if (res.data.success) {
        setStep(2);
        setMessage('確認コードを送信しました');
      }
    } catch (err) {
      setMessage('確認コードの送信に失敗しました');
    }
  };

  const handleVerifyAndSignup = async () => {
    try {
      const verifyRes = await axios.post('http://localhost:5000/api/verify-code', {
        username: form.username,
        code
      });
      if (verifyRes.data.success) {
        const signupRes = await axios.post('http://localhost:5000/api/signup', form);
        if (signupRes.data.success) {
          alert('登録が完了しました！ログインしてください');
          navigate('/login');
        }
      }
    } catch (err) {
      setMessage('確認コードが正しくありません');
    }
  };

  const fields = [
    { name: 'username', label: 'ユーザID', type: 'text' },
    { name: 'password', label: 'パスワード', type: 'password' },
    { name: 'name', label: '名前', type: 'text' },
    { name: 'address', label: '住所', type: 'text' },
    { name: 'age', label: '年齢', type: 'number' },
    { name: 'email', label: 'メールアドレス', type: 'text' }
  ];

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url(/images/landing.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', width: '400px', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center' }}>新規登録</h2>

        {step === 1 ? (
          <>
            {fields.map((field, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <label htmlFor={field.name} style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
            ))}
            <button onClick={handleSignupStep1} style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              確認コードを送信
            </button>
          </>
        ) : (
          <>
            <p>メールで送信された確認コードを入力してください。</p>
            <input
              type="text"
              /*value={code}*/
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '16px' }}
              placeholder="確認コード"
            />
            <button onClick={handleVerifyAndSignup} style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              登録を完了する
            </button>
          </>
        )}

        {message && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
}

export default SignupPage;
