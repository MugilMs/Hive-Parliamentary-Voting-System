import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUsername }) => {
  const [inputUsername, setInputUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputUsername) {
      alert('Please enter your Hive username');
      return;
    }

    setIsLoading(true);
    try {
      if (window.hive_keychain) {
        // Request a simple signature to verify the user's identity
        window.hive_keychain.requestSignBuffer(
          inputUsername,
          'Login to Parliamentary Voting System',
          'Posting',
          (response) => {
            if (response.success) {
              setUsername(inputUsername);
              navigate('/home');
            } else {
              alert('Authentication failed. Please try again.');
            }
            setIsLoading(false);
          }
        );
      } else {
        alert('Please install Hive Keychain to authenticate');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <div className="app-logo">PV</div>
        </div>
        <h1>Parliamentary Voting System</h1>
        <p className="login-description">
          Secure, transparent, and immutable blockchain-based voting system for government institutions and policy makers.
        </p>
        
        {!window.hive_keychain && (
          <div className="keychain-warning">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <strong>Hive Keychain not detected!</strong>
              <p>Please{' '}
                <a href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep" 
                  target="_blank" 
                  rel="noopener noreferrer">
                  install the extension
                </a>
                {' '}to authenticate securely.
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Member ID</label>
            <div className="input-wrapper">
              <span className="input-prefix">@</span>
              <input
                id="username"
                type="text"
                placeholder="Enter your member identification"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value.toLowerCase())}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || !window.hive_keychain || !inputUsername.trim()}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Authenticating...
              </>
            ) : (
              <>
                <span className="button-icon">🔐</span>
                Secure Authentication
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>New member? <a href="https://signup.hive.io/" target="_blank" rel="noopener noreferrer">Request credentials</a></p>
          <p className="learn-more">
            <a href="https://hive.io/" target="_blank" rel="noopener noreferrer">Learn about our blockchain security</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 