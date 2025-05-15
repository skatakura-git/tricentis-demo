import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './LandingPage.css';

function LookupPage() {
  const [reservationId, setReservationId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLookup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/purchase/${reservationId}`);
      setResult(res.data);
      setError('');
    } catch (err) {
      setResult(null);
      setError('Reservation not found.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Tricentis Ticket Confirmation', 20, 30);
    doc.text(`Reservation ID: ${reservationId}`, 20, 40);
    doc.text(`Departure: ${result.departureDate}`, 20, 80);
    doc.text(`Return: ${result.returnDate}`, 20, 90);
    doc.text(`Passengers: ${result.passengerCount}`, 20, 100);
    doc.save(`reservation_${reservationId}.pdf`);
  };

  return (
    <div className="landing-container" style={{ backgroundImage: 'url(/images/landing.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>          
          <img src="/images/logo.png" alt="Logo" />
          <h1 className="landing-title">Tricentis 航空券予約</h1>
        </div>
        {username && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>ようこそ {username} さん</span>
            <button onClick={handleLogout} className="landing-login-button">
              ログアウト
            </button>
          </div>
        )}
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h2>Search by Reservation ID</h2>
          <input
            type="text"
            placeholder="Enter Reservation ID"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            style={{ padding: '10px', width: '80%', marginTop: '20px' }}
          />
          <br />
          <button onClick={handleLookup} style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Search
          </button>

          {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

          {result && (
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
              <h3>Reservation Details</h3>
              <p><strong>Name:</strong> {result.name}</p>
              <p><strong>From:</strong> {result.departureAirport}</p>
              <p><strong>To:</strong> {result.arrivalAirport}</p>
              <p><strong>Departure:</strong> {result.departureDate}</p>
              <p><strong>Return:</strong> {result.returnDate}</p>
              <p><strong>Passengers:</strong> {result.passengerCount}</p>
              <button onClick={handleDownloadPDF} style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Download PDF
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LookupPage;
