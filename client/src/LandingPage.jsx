import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToReservation = () => {
    const user = localStorage.getItem('username');
    if (user) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const goToLookup = () => {
    navigate('/lookup');
  };

  return (
    <div className="landing-container">
      {/* ヘッダー */}
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Logo" />
          <h1 className="landing-title">Tricentis 航空券予約</h1>
        </div>
        <button onClick={goToLogin} className="landing-login-button">
          ログイン
        </button>
      </header>

      {/* メイン */}
      <main className="landing-main" style={{ position: 'relative' }}>
        {/* 背景画像 */}
        <img
          src="/images/landing.jpg"
          alt="Hero"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '100%',
            height: 'auto',
            objectFit: 'cover'
          }}
        />

        {/* メニュー重ね表示 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '50px',
          borderRadius: '16px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
          minWidth: '400px'
        }}>
          <button onClick={goToReservation} style={{
            padding: '20px 60px',
            fontSize: '20px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}>
            航空券予約
          </button>
          <button onClick={goToLookup} style={{
            padding: '20px 60px',
            fontSize: '20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}>
            航空券確認
          </button>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;