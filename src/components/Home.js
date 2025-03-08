import React, { useState } from 'react';
import TrendingPosts from './TrendingPosts';
import CreatePost from './CreatePost';
import SearchProposals from './SearchProposals';
import Marketplace from './Marketplace';
import EnterpriseServices from './EnterpriseServices';

const Home = ({ username, onLogout, onTransfer }) => {
  const [activeView, setActiveView] = useState('explore');

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return <CreatePost username={username} />;
      case 'search':
        return <SearchProposals username={username} />;
      case 'marketplace':
        return <Marketplace username={username} />;
      case 'enterprise':
        return <EnterpriseServices username={username} />;
      case 'explore':
      default:
        return <TrendingPosts username={username} />;
    }
  };

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="welcome-text">
            <h2>Welcome, <span className="username">@{username}</span></h2>
            <p className="welcome-message">Access active legislative proposals and cast your votes on the blockchain</p>
          </div>
        </div>
        <div className="welcome-actions">
          <button onClick={onTransfer} className="welcome-transfer-button">
            <span className="button-icon">📑</span>
            Delegate
          </button>
          <button onClick={onLogout} className="logout-button">
            <span className="button-icon">↪️</span>
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="navigation-tabs">
        <button 
          className={`nav-tab ${activeView === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveView('explore')}
        >
          <span className="tab-icon">🗳️</span>
          <span className="tab-text">Active Proposals</span>
        </button>
        <button 
          className={`nav-tab ${activeView === 'search' ? 'active' : ''}`}
          onClick={() => setActiveView('search')}
        >
          <span className="tab-icon">🔍</span>
          <span className="tab-text">Search</span>
        </button>
        <button 
          className={`nav-tab ${activeView === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveView('marketplace')}
        >
          <span className="tab-icon">🛒</span>
          <span className="tab-text">Marketplace</span>
        </button>
        <button 
          className={`nav-tab ${activeView === 'enterprise' ? 'active' : ''}`}
          onClick={() => setActiveView('enterprise')}
        >
          <span className="tab-icon">💼</span>
          <span className="tab-text">Enterprise</span>
        </button>
        <button 
          className={`nav-tab ${activeView === 'create' ? 'active' : ''}`}
          onClick={() => setActiveView('create')}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-text">Submit Proposal</span>
        </button>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home; 