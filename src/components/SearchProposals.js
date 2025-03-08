import React, { useState } from 'react';
const hive = require('@hiveio/hive-js');

const SearchProposals = ({ username }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Legislative categories for filtering
  const legislativeCategories = [
    'all', 'governance', 'legislation', 'policy', 'finance', 'education', 
    'healthcare', 'infrastructure', 'defense', 'environment', 'justice'
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim() && searchCategory === 'all') {
      setError('Please enter a search term or select a category');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    
    try {
      // Set Hive API node
      hive.api.setOptions({ url: 'https://api.hive.blog' });
      
      // Use the selected category or default to general tag
      const tag = searchCategory !== 'all' ? searchCategory : 'hive';
      const limit = 30; // Get more results for filtering
      
      // Fetch discussions by trending first
      let result = [];
      try {
        result = await new Promise((resolve, reject) => {
          hive.api.getDiscussionsByTrending({ tag, limit }, (err, response) => {
            if (err) reject(err);
            else resolve(response || []);
          });
        });
      } catch (apiError) {
        console.error('Hive API error:', apiError);
        // Fall back to an empty array if API fails
        result = [];
      }
      
      // Ensure we have an array to work with
      if (!Array.isArray(result)) {
        console.warn('API did not return an array, converting to array:', result);
        result = Object.values(result || {});
        
        // If it's still not an array, use an empty array
        if (!Array.isArray(result)) {
          result = [];
        }
      }
      
      console.log('Search results from API:', result);
      
      // Filter results based on search term if provided
      let filteredResults = result;
      
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filteredResults = result.filter(post => {
          // Ensure post and its properties exist before accessing
          if (!post) return false;
          
          const title = post.title || '';
          const body = post.body || '';
          const author = post.author || '';
          
          return (
            title.toLowerCase().includes(term) || 
            body.toLowerCase().includes(term) ||
            author.toLowerCase().includes(term)
          );
        });
      }
      
      // Format the results safely
      const formattedResults = filteredResults.map(post => {
        if (!post) return null; // Skip invalid posts
        
        // Safely extract properties
        const title = post.title || 'Untitled Proposal';
        const body = post.body || '';
        const author = post.author || 'Unknown';
        const created = post.created || new Date().toISOString();
        const permlink = post.permlink || '';
        
        // Create a snippet from the post body safely
        const bodyText = body.replace(/(<([^>]+)>)/gi, "");
        let snippet = '';
        
        if (searchTerm.trim()) {
          const snippetStart = bodyText.toLowerCase().indexOf(searchTerm.toLowerCase());
          snippet = snippetStart > -1 
            ? `...${bodyText.substring(Math.max(0, snippetStart - 50), Math.min(bodyText.length, snippetStart + 100))}...`
            : bodyText.substring(0, 150);
        } else {
          snippet = bodyText.substring(0, 150);
        }
        
        if (snippet) {
          snippet += '...';
        }
        
        return {
          ...post,
          title,
          body,
          author,
          created,
          permlink,
          snippet
        };
      }).filter(Boolean); // Remove any null results
      
      setSearchResults(formattedResults);
      setIsLoading(false);
      
      if (formattedResults.length === 0) {
        setError('No results found. Try different search terms or categories.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`Search failed: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Format the proposal title to make it more legislative-sounding
  const formatProposalTitle = (title) => {
    if (!title) return 'Untitled Proposal';
    
    // If title already starts with legislative terms, leave it as is
    if (/^(bill|act|proposal|motion|resolution|amendment)/i.test(title)) {
      return title;
    }
    
    // Otherwise, prepend "Proposal:"
    return `Proposal: ${title}`;
  };

  return (
    <div className="search-container">
      <div className="section-header">
        <h2>Search Legislative Proposals</h2>
        <p className="section-description">Find specific proposals by keyword, author, or category</p>
      </div>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-row">
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter keywords to search..."
              className="search-input"
            />
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-category"
            >
              {legislativeCategories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="search-button">
            <span className="button-icon">🔍</span>
            Search
          </button>
        </div>
      </form>
      
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Searching proposals...</p>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      {!isLoading && searchResults.length > 0 && (
        <div className="search-results">
          <h3>Found {searchResults.length} Proposals</h3>
          
          <div className="results-list">
            {searchResults.map((post, index) => {
              // Generate a consistent ID from permlink if post.id is not available
              const proposalId = post.id 
                ? post.id.substring(0, 8) 
                : (post.permlink ? post.permlink.substring(0, 8) : `post-${index}`);
              
              return (
                <div key={proposalId} className="result-card">
                  <div className="proposal-status">
                    <span className="status-indicator">Active</span>
                    <span className="proposal-id">ID: {proposalId}</span>
                  </div>
                  
                  <h3 className="result-title">{formatProposalTitle(post.title)}</h3>
                  
                  <div className="result-meta">
                    <span className="result-author">
                      <span className="author-avatar">
                        {post.author.charAt(0).toUpperCase()}
                      </span>
                      Proposed by: @{post.author}
                    </span>
                    <span className="result-date">
                      {new Date(post.created).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="result-snippet">{post.snippet || "No preview available."}</p>
                  
                  <div className="result-stats">
                    <span className="stat-item">
                      <span className="stat-icon">🗳️</span>
                      {post.net_votes || 0} votes
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">💬</span>
                      {post.children || 0} comments
                    </span>
                  </div>
                  
                  <a 
                    href={`https://hive.blog/@${post.author}/${post.permlink}`}
                    className="view-proposal-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Full Proposal
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {!isLoading && searchResults.length === 0 && !error && searchTerm && (
        <div className="empty-state">
          <p>No proposals found matching your search. Try different keywords or categories.</p>
        </div>
      )}
    </div>
  );
};

export default SearchProposals; 