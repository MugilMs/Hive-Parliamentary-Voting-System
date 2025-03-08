import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';
import TransferModal from './components/TransferModal';

function App() {
  const [username, setUsername] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleLogout = () => {
    setUsername('');
  };

  const handleTransfer = async (amount, memo, currency) => {
    return new Promise((resolve, reject) => {
      if (!username) {
        reject(new Error('Please authenticate first'));
        return;
      }

      const recipient = window.prompt('Enter recipient member ID:');
      if (!recipient) {
        reject(new Error('Recipient is required'));
        return;
      }

      window.hive_keychain.requestTransfer(
        username,
        recipient,
        amount,
        memo,
        currency,
        (response) => {
          if (response.success) {
            alert(`Successfully delegated ${amount} ${currency} to @${recipient}`);
            resolve(response);
          } else {
            reject(new Error(response.message || 'Delegation failed'));
          }
        }
      );
    });
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              username ? (
                <Navigate to="/home" replace />
              ) : (
                <Login setUsername={setUsername} />
              )
            } 
          />
          <Route 
            path="/home" 
            element={
              username ? (
                <Home 
                  username={username} 
                  onLogout={handleLogout}
                  onTransfer={() => setShowTransferModal(true)}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>

        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          recipient=""
          onTransfer={handleTransfer}
        />
      </div>
    </BrowserRouter>
  );
}

export default App; 