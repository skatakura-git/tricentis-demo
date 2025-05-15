// ConfirmationPage.jsx（更新済み）
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [price, setPrice] = useState(null);
  const [reservationId, setReservationId] = useState(null);

  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    returnDate,
    passengerCount
  } = location.state || {};

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
      axios.get(`http://localhost:5000/api/user/${user}`).then((res) => {
        setName(res.data.name);
        setAddress(res.data.address);
        setAge(res.data.age);
        setEmail(res.data.email);
      });
    } else {
      navigate('/login');
    }

    if (departureAirport && arrivalAirport) {
      axios
        .get('http://localhost:5000/api/pricing', {
          params: {
            from: departureAirport,
            to: arrivalAirport
          }
        })
        .then(res => setPrice(res.data.price))
        .catch(() => setPrice('取得エラー'));
    }
  }, [departureAirport, arrivalAirport, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!name || !address || !age || !email || !cardNumber) {
      alert('すべての情報を入力してください。');
      return;
    }

    const purchaseData = {
      username,
      name,
      address,
      age,
      email,
      cardNumber,
      departureAirport,
      arrivalAirport,
      departureDate,
      returnDate,
      passengerCount
    };

    try {
      const res = await axios.post('http://localhost:5000/api/purchase', purchaseData);
      setReservationId(res.data.reservationId);
    } catch (error) {
      alert('予約登録に失敗しました。');
    }
  };

  if (!location.state) {
    return <p>予約データが見つかりません。</p>;
  }

  return (
    <div className="landing-container">
      {/* ヘッダー */}
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleLogoClick}>
          <img src="/images/logo.png" alt="Logo" />
          <h1 className="landing-title">Tricentis 航空券予約</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>
            ようこそ {username} さん
          </span>
          <button onClick={handleLogout} className="landing-login-button">
            ログアウト
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2>予約内容の確認</h2>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><strong>出発地:</strong> {departureAirport}</li>
          <li><strong>到着地:</strong> {arrivalAirport}</li>
          <li><strong>往路:</strong> {departureDate}</li>
          <li><strong>復路:</strong> {returnDate}</li>
          <li><strong>人数:</strong> {passengerCount}人</li>
          <li><strong>合計金額:</strong> {price !== null ? `¥${price * passengerCount}` : '読み込み中...'}</li>
        </ul>

        <hr style={{ margin: '20px 0' }} />

        {!reservationId ? (
          <form onSubmit={handleConfirm}>
            <div style={{ marginBottom: '10px' }}>
              <label>名前:</label><br />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>住所:</label><br />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>年齢:</label><br />
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>メールアドレス:</label><br />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>クレジットカード番号:</label><br />
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>

            <button type="submit" style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              この内容で購入する
            </button>
          </form>
        ) : (
          <div style={{ marginTop: '20px', color: '#1e3a8a', fontWeight: 'bold' }}>
            ご予約ありがとうございます！<br />
            あなたの予約番号：<span style={{ fontSize: '1.2em' }}>{reservationId}</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default ConfirmationPage;
