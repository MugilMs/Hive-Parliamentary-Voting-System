import React, { useState } from 'react';
import TrendingPosts from './TrendingPosts';
import CreatePost from './CreatePost';

const Home = ({ username, onLogout, onTransfer }) => {
  const [activeView, setActiveView] = useState('explore');

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return <CreatePost username={username} />;
      case 'explore':
      default:
        return <TrendingPosts username={username} />;
    }
  };

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <h2>Welcome, @{username}! 👋</h2>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      
      <div className="action-buttons">
        <button 
          className={`action-button explore ${activeView === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveView('explore')}
        >
          🔍 EXPLORE POSTS
        </button>
        <button 
          className={`action-button create ${activeView === 'create' ? 'active' : ''}`}
          onClick={() => setActiveView('create')}
        >
          ✍️ CREATE POST
        </button>
        <button 
          className="action-button transfer"
          onClick={onTransfer}
        >
          💸 TRANSFER HIVE
        </button>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home; 