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
          'Login to Hive Social Explorer',
          'Posting',
          (response) => {
            if (response.success) {
              setUsername(inputUsername);
              navigate('/home');
            } else {
              alert('Login failed. Please try again.');
            }
            setIsLoading(false);
          }
        );
      } else {
        alert('Please install Hive Keychain to login');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Hive Social Explorer</h1>
        <p className="login-description">
          Connect with the Hive blockchain community. Explore trending posts, create content, and engage with other users.
        </p>
        {!window.hive_keychain && (
          <div className="keychain-warning">
            ⚠️ Hive Keychain not detected! Please{' '}
            <a href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep" 
               target="_blank" 
               rel="noopener noreferrer">
              install the extension
            </a>
            {' '}to continue.
          </div>
        )}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Enter your Hive username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value.toLowerCase())}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !window.hive_keychain}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Logging in...
              </>
            ) : (
              'Login with Hive Keychain'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 