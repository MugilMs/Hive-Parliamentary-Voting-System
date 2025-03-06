import React, { useState, useEffect } from 'react';
import TransferModal from './TransferModal';
const hive = require('@hiveio/hive-js');

const TrendingPosts = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState({});

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      // Set Hive API node
      hive.api.setOptions({ url: 'https://api.hive.blog' });
      
      // Query parameters
      const query = {
        tag: 'hive',
        limit: 10
      };

      // Fetch trending posts
      const result = await new Promise((resolve, reject) => {
        hive.api.getDiscussionsByTrending(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      setPosts(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
      setLoading(false);
    }
  };

  const handleVote = async (author, permlink) => {
    if (!username) {
      alert('Please login first to vote');
      return;
    }

    if (!window.hive_keychain) {
      alert('Please install Hive Keychain extension to vote');
      return;
    }

    // Find the post
    const post = posts.find(p => p.author === author && p.permlink === permlink);
    if (!post) {
      alert('Post not found');
      return;
    }

    // Check if user has already voted
    const existingVote = post.active_votes?.find(vote => vote.voter === username);
    if (existingVote) {
      alert('You have already voted on this post');
      return;
    }

    // Set voting in progress for this post
    setVotingInProgress(prev => ({ ...prev, [`${author}-${permlink}`]: true }));

    try {
      // Request vote through Hive Keychain
      window.hive_keychain.requestVote(
        username,
        permlink,
        author,
        10000, // 100% upvote weight (10000 = 100%)
        async (response) => {
          if (response.success) {
            // Update the posts list to reflect the new vote
            const updatedPosts = posts.map(post => {
              if (post.author === author && post.permlink === permlink) {
                return {
                  ...post,
                  net_votes: post.net_votes + 1,
                  active_votes: [...(post.active_votes || []), { voter: username, percent: 10000 }]
                };
              }
              return post;
            });
            setPosts(updatedPosts);
            
            // Show success message
            alert('Vote successful!');
          } else {
            console.error('Vote failed:', response);
            alert(`Vote failed: ${response.message || 'Unknown error'}`);
          }
          
          // Clear voting in progress
          setVotingInProgress(prev => ({ ...prev, [`${author}-${permlink}`]: false }));
        }
      );
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to vote. Please make sure Hive Keychain is installed and unlocked.');
      setVotingInProgress(prev => ({ ...prev, [`${author}-${permlink}`]: false }));
    }
  };

  const handleTransferClick = (author) => {
    if (!username) {
      alert('Please login first to transfer');
      return;
    }
    setSelectedAuthor(author);
    setShowTransferModal(true);
  };

  const handleTransfer = async (amount, memo, currency) => {
    return new Promise((resolve, reject) => {
      if (!username || !selectedAuthor) {
        reject(new Error('Please login first'));
        return;
      }

      if (!window.hive_keychain) {
        reject(new Error('Please install Hive Keychain extension'));
        return;
      }

      // Validate amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        reject(new Error('Please enter a valid amount'));
        return;
      }

      window.hive_keychain.requestTransfer(
        username,
        selectedAuthor,
        amount,
        memo,
        currency,
        (response) => {
          if (response.success) {
            alert(`Successfully sent ${amount} ${currency} to @${selectedAuthor}`);
            resolve(response);
          } else {
            let errorMessage = response.message || 'Transfer failed';
            
            // Check for specific error about active key
            if (errorMessage.includes('active key') || errorMessage.includes('has not been added')) {
              errorMessage = 'Please add your active key to Hive Keychain to make transfers. Open Hive Keychain extension → Add Account → Enter your active private key.';
            }
            
            reject(new Error(errorMessage));
          }
        }
      );
    });
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trending-posts">
      <h2>Trending Posts</h2>
      <div className="posts-grid">
        {posts.map((post) => {
          const hasVoted = post.active_votes?.some(vote => vote.voter === username);
          
          return (
            <div key={`${post.author}-${post.permlink}`} className="post-card">
              <h3>{post.title}</h3>
              <div className="post-meta">
                <span>Author: @{post.author}</span>
                <span>• {new Date(post.created).toLocaleDateString()}</span>
              </div>
              <div className="post-stats">
                <span>💰 ${parseFloat(post.pending_payout_value).toFixed(2)}</span>
                <span>👍 {post.net_votes} votes</span>
                <span>💬 {post.children} comments</span>
              </div>
              {username && (
                <div className="action-buttons">
                  <button 
                    className={`vote-button ${votingInProgress[`${post.author}-${post.permlink}`] ? 'voting' : ''} ${hasVoted ? 'voted' : ''}`}
                    onClick={() => handleVote(post.author, post.permlink)}
                    disabled={votingInProgress[`${post.author}-${post.permlink}`] || hasVoted}
                  >
                    {votingInProgress[`${post.author}-${post.permlink}`] ? (
                      <>
                        <span className="loading-spinner"></span>
                        Voting...
                      </>
                    ) : hasVoted ? (
                      <>
                        <span className="button-icon">✓</span>
                        Voted
                      </>
                    ) : (
                      <>
                        <span className="button-icon">👍</span>
                        Upvote
                      </>
                    )}
                  </button>
                  <button 
                    className="transfer-button"
                    onClick={() => handleTransferClick(post.author)}
                  >
                    <span className="button-icon">💸</span>
                    Send Tip
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        recipient={selectedAuthor}
        onTransfer={handleTransfer}
      />
    </div>
  );
};

export default TrendingPosts; 