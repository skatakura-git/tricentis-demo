import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // ヘッダーのCSSを再利用

function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    navigate('/confirm', {
      state: {
        departureAirport,
        arrivalAirport,
        departureDate,
        returnDate,
        passengerCount,
      },
    });
  };

  const airports = [
    '東京（羽田）',
    '東京（成田）',
    '大阪（伊丹）',
    '大阪（関西）',
    '名古屋（中部）',
    '福岡',
    '札幌（新千歳）',
    '沖縄（那覇）',
    'ソウル（仁川）',
    'シンガポール（チャンギ）',
  ];

  return (
    <div className="landing-container">
      {/* ヘッダー */}
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

      {/* メイン：予約フォーム */}
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <form onSubmit={handleSubmit} style={{
          width: '600px',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e3a8a' }}>航空券予約</h2>

          {/* 出発地 + 到着地 */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>出発地:</label><br />
              <select
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value)}
                required
                style={{ width: '100%', padding: '10px' }}
              >
                <option value="">選択してください</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>到着地:</label><br />
              <select
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                required
                style={{ width: '100%', padding: '10px' }}
              >
                <option value="">選択してください</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 往路日付 + 復路日付 */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>往路の日付:</label><br />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                style={{ width: '100%', padding: '10px' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>復路の日付:</label><br />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                style={{ width: '100%', padding: '10px' }}
              />
            </div>
          </div>

          {/* 人数 */}
          <div style={{ marginBottom: '20px' }}>
            <label>人数:</label><br />
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              required
              style={{ width: '100%', padding: '10px' }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}人</option>
              ))}
            </select>
          </div>

          {/* 予約ボタン */}
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
            予約する
          </button>
        </form>
      </main>
    </div>
  );
}

export default HomePage;
