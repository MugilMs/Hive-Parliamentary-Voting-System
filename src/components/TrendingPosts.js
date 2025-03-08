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
  const [retryCount, setRetryCount] = useState(0);
  
  // Legislative categories for filtering
  const legislativeCategories = ['governance', 'legislation', 'policy', 'finance', 'education', 'healthcare', 'infrastructure', 'defense', 'environment', 'justice'];

  useEffect(() => {
    fetchTrendingPosts();
  }, [retryCount]); // Re-fetch when retry count changes

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set Hive API node
      hive.api.setOptions({ url: 'https://api.hive.blog' });
      
      // Query parameters - use governance tag to find relevant content
      const query = {
        tag: 'governance',
        limit: 20 // Fetch more to filter for relevant content
      };

      // Fetch trending posts
      const result = await new Promise((resolve, reject) => {
        hive.api.getDiscussionsByTrending(query, (err, result) => {
          if (err) reject(err);
          else resolve(result || []);
        });
      });
      
      if (!Array.isArray(result)) {
        throw new Error('Invalid response from Hive API. Expected an array of proposals.');
      }
      
      // Filter posts to show only those relevant to legislative topics
      const filteredPosts = result.filter(post => {
        // Parse JSON metadata to get tags
        try {
          const metadata = JSON.parse(post.json_metadata);
          const tags = metadata.tags || [];
          
          // Check if post has any legislative category tag
          return tags.some(tag => legislativeCategories.includes(tag.toLowerCase()));
        } catch (e) {
          return false;
        }
      }).slice(0, 10); // Limit to 10 posts after filtering

      // If no relevant posts found, use the original results
      setPosts(filteredPosts.length > 0 ? filteredPosts : result.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching legislative proposals:', error);
      
      // Provide more specific error messages based on the error type
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        setError('Network timeout. Please check your connection and try again.');
      } else if (error.message?.includes('API')) {
        setError('Hive API unavailable. The blockchain service might be experiencing issues.');
      } else {
        setError(`Failed to load legislative proposals: ${error.message || 'Unknown error'}`);
      }
      
      setLoading(false);
    }
  };

  // Format the proposal title to make it more legislative-sounding
  const formatProposalTitle = (title) => {
    // If title already starts with legislative terms, leave it as is
    if (/^(bill|act|proposal|motion|resolution|amendment)/i.test(title)) {
      return title;
    }
    
    // Otherwise, prepend "Proposal:"
    return `Proposal: ${title}`;
  };

  const handleVote = async (author, permlink) => {
    if (!username) {
      showErrorToast('Please authenticate first to vote on proposals');
      return;
    }

    if (!window.hive_keychain) {
      showErrorToast('Please install Hive Keychain extension to cast secure votes');
      return;
    }

    // Find the post
    const post = posts.find(p => p.author === author && p.permlink === permlink);
    if (!post) {
      showErrorToast('Proposal not found');
      return;
    }

    // Check if user has already voted
    const existingVote = post.active_votes?.find(vote => vote.voter === username);
    if (existingVote) {
      showErrorToast('You have already voted on this proposal');
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
            
            // Show success message as toast
            showSuccessToast('Vote successfully recorded on the blockchain');
          } else {
            console.error('Vote failed:', response);
            showErrorToast(`Vote failed: ${response.message || 'Unknown error'}`);
          }
          
          // Clear voting in progress
          setVotingInProgress(prev => ({ ...prev, [`${author}-${permlink}`]: false }));
        }
      );
    } catch (error) {
      console.error('Vote error:', error);
      showErrorToast('Failed to vote. Please make sure Hive Keychain is installed and unlocked.');
      setVotingInProgress(prev => ({ ...prev, [`${author}-${permlink}`]: false }));
    }
  };

  const handleTransferClick = (author) => {
    if (!username) {
      alert('Please authenticate first to delegate voting power');
      return;
    }
    setSelectedAuthor(author);
    setShowTransferModal(true);
  };

  const handleTransfer = async (amount, memo, currency) => {
    return new Promise((resolve, reject) => {
      if (!username || !selectedAuthor) {
        reject(new Error('Please authenticate first'));
        return;
      }

      if (!window.hive_keychain) {
        reject(new Error('Please install Hive Keychain extension'));
        return;
      }

      // Validate amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        reject(new Error('Please enter a valid delegation amount'));
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
            alert(`Successfully delegated ${amount} ${currency} to @${selectedAuthor}`);
            resolve(response);
          } else {
            let errorMessage = response.message || 'Delegation failed';
            
            // Check for specific error about active key
            if (errorMessage.includes('active key') || errorMessage.includes('has not been added')) {
              errorMessage = 'Please add your active key to Hive Keychain to make delegations. Open Hive Keychain extension → Add Account → Enter your active private key.';
            }
            
            reject(new Error(errorMessage));
          }
        }
      );
    });
  };

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  // Add these toast notification functions
  const showErrorToast = (message) => {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-error');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create and display a new toast
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const showSuccessToast = (message) => {
    // Create a success version of the toast
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner-large"></div>
      <p>Loading legislative proposals...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error Loading Proposals</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={handleRetry}>
        Try Again
      </button>
    </div>
  );

  return (
    <div className="trending-posts">
      <div className="section-header">
        <h2>Active Legislative Proposals</h2>
        <p className="section-description">Review and vote on current parliamentary proposals secured by blockchain technology</p>
      </div>
      
      <div className="posts-grid">
        {posts.map((post) => {
          const hasVoted = post.active_votes?.some(vote => vote.voter === username);
          const postBodyPreview = post.body ? post.body.replace(/(<([^>]+)>)/gi, "").slice(0, 150) + "..." : "";
          const formattedTitle = formatProposalTitle(post.title);
          
          // Calculate vote statistics
          const yesVotes = post.net_votes > 0 ? post.net_votes : 0;
          const totalVotes = post.active_votes?.length || 0;
          const percentageApproval = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
          
          // Generate a consistent ID from permlink if post.id is not available
          const proposalId = post.id ? post.id.substring(0, 8) : post.permlink.substring(0, 8);
          
          return (
            <div key={`${post.author}-${post.permlink}`} className="post-card">
              <div className="proposal-status">
                <span className="status-indicator">Active</span>
                <span className="proposal-id">ID: {proposalId}</span>
              </div>
              
              <h3 className="post-title">{formattedTitle}</h3>
              
              <div className="post-meta">
                <div className="author-info">
                  <span className="author-avatar">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                  <span className="author-name">Proposed by: @{post.author}</span>
                </div>
                <span className="post-date">Submitted: {new Date(post.created).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
              
              <p className="post-preview">{postBodyPreview}</p>
              
              <div className="post-stats">
                <div className="stat-item">
                  <span className="stat-icon">⚖️</span>
                  <span className="stat-value">${parseFloat(post.pending_payout_value).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🗳️</span>
                  <span className="stat-value">{post.net_votes} votes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📊</span>
                  <span className="stat-value">{percentageApproval}% approval</span>
                </div>
              </div>
              
              <div className="post-tags">
                {post.json_metadata && JSON.parse(post.json_metadata).tags?.filter(tag => 
                  legislativeCategories.includes(tag.toLowerCase())
                ).slice(0, 3).map(tag => (
                  <span className="tag" key={tag}>#{tag}</span>
                ))}
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
                        Casting Vote...
                      </>
                    ) : hasVoted ? (
                      <>
                        <span className="button-icon">✓</span>
                        Vote Recorded
                      </>
                    ) : (
                      <>
                        <span className="button-icon">🗳️</span>
                        Cast Vote
                      </>
                    )}
                  </button>
                  <button 
                    className="transfer-button"
                    onClick={() => handleTransferClick(post.author)}
                  >
                    <span className="button-icon">📑</span>
                    Delegate
                  </button>
                </div>
              )}
              
              <a 
                href={`https://hive.blog/@${post.author}/${post.permlink}`} 
                className="read-more-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Proposal →
              </a>
            </div>
          );
        })}
      </div>

      {posts.length === 0 && !loading && !error && (
        <div className="empty-state">
          <p>No active legislative proposals found at this time.</p>
        </div>
      )}

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