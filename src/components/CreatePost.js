import React, { useState, useEffect } from 'react';
const hive = require('@hiveio/hive-js');

const CreatePost = ({ username }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('governance,legislation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeout, setTimeout] = useState(null);
  
  // Available legislative categories
  const availableCategories = [
    'governance', 'legislation', 'policy', 'finance', 'education', 
    'healthcare', 'infrastructure', 'defense', 'environment', 'justice'
  ];

  // Sample template for structured legislative proposal
  const proposalTemplate = `# LEGISLATIVE PROPOSAL

## SUMMARY
[Provide a brief overview of the proposed legislation]

## BACKGROUND
[Explain the context and need for this proposal]

## OBJECTIVES
[List the specific goals this legislation aims to achieve]

## KEY PROVISIONS
[Detail the main components of the proposed legislation]

## IMPLEMENTATION TIMELINE
[Outline when different aspects of the legislation would take effect]

## FISCAL IMPACT
[Describe any budgetary implications]

## VOTING CONSIDERATIONS
[Highlight key points members should consider when voting]
`;

  // Add toast notification for error messages
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

  // Clean text from problematic characters and patterns
  const sanitizeText = (text) => {
    // Remove or replace potentially problematic patterns
    let cleaned = text;
    
    // Handle repeated URLs and potentially malicious content
    if (cleaned.includes('http') && cleaned.split('http').length > 3) {
      // Multiple URLs detected, likely spam or error
      cleaned = cleaned.substring(0, 500) + "..."; // Truncate long spam
    }
    
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate inputs
    if (!title.trim()) {
      setErrorMessage('Please enter a proposal title');
      showErrorToast('Please enter a proposal title');
      return;
    }
    
    if (!body.trim()) {
      setErrorMessage('Please enter proposal details');
      showErrorToast('Please enter proposal details');
      return;
    }
    
    // Sanitize the content
    const sanitizedBody = sanitizeText(body);
    
    if (!tags.trim()) {
      setErrorMessage('Please enter at least one category tag');
      showErrorToast('Please enter at least one category tag');
      return;
    }

    // Check if Hive Keychain is available
    if (!window.hive_keychain) {
      setErrorMessage('Hive Keychain extension is required for secure proposal submission. Please install it and refresh the page.');
      showErrorToast('Hive Keychain extension is required');
      return;
    }

    // Start submission
    setIsSubmitting(true);
    
    // Set a timeout to avoid the UI getting stuck if the request doesn't complete
    const timeoutId = window.setTimeout(() => {
      setIsSubmitting(false);
      setErrorMessage('Submission timed out. The request to Hive blockchain took too long. Please try again.');
      showErrorToast('Submission timed out');
    }, 30000); // 30 seconds timeout
    
    setTimeout(timeoutId);
    
    try {
      // Format tags properly - ensure they're simple strings without spaces or special characters
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
        .filter(tag => tag);
      
      // Ensure first tag is a valid governance-related tag
      if (!availableCategories.includes(tagArray[0])) {
        tagArray.unshift('governance');
      }
      
      // Limit to maximum 5 tags (Hive requirement)
      const limitedTags = tagArray.slice(0, 5);
      
      // Create a simpler permlink to avoid issues
      const permlink = `proposal-${Date.now()}`;
      
      // Prepare post metadata (keep it simple)
      const jsonMetadata = {
        tags: limitedTags,
        app: 'parliamentary-voting-system'
      };

      // Primary tag must be first in the tags array
      const primaryTag = limitedTags[0];
      
      console.log('Submitting proposal with:', { 
        author: username, 
        title, 
        permlink,
        parentAuthor: '', 
        parentPermlink: primaryTag,
        jsonMetadata: JSON.stringify(jsonMetadata)
      });
      
      // Use direct operations to be clearer about what's happening
      const operations = [
        ["comment", {
          parent_author: "",
          parent_permlink: primaryTag,
          author: username,
          permlink: permlink,
          title: title,
          body: sanitizedBody,
          json_metadata: JSON.stringify(jsonMetadata)
        }]
      ];
      
      // Submit directly with requestBroadcast instead of requestPost
      window.hive_keychain.requestBroadcast(
        username,
        operations,
        "posting", // Use posting key, not active key
        (response) => {
          // Clear the timeout since we got a response
          if (timeout) {
            window.clearTimeout(timeout);
          }
          
          if (response.success) {
            console.log('Proposal submitted successfully:', response);
            setSuccessMessage('Your legislative proposal has been successfully submitted to the blockchain');
            // Clear form
            setTitle('');
            setBody('');
            setTags('governance,legislation');
          } else {
            console.error('Proposal submission failed:', response);
            // More detailed error message
            const errorMsg = response.message || 'Unknown error';
            setErrorMessage(`Failed to submit proposal: ${errorMsg}`);
            showErrorToast(`Submission failed: ${errorMsg}`);
          }
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      // Clear the timeout if there's an exception
      if (timeout) {
        window.clearTimeout(timeout);
      }
      
      console.error('Error submitting proposal:', error);
      setErrorMessage(`Failed to submit proposal: ${error.message || 'Unknown error'}`);
      showErrorToast(`Submission error: ${error.message || 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };
  
  const loadTemplate = () => {
    if (body.trim() === '' || window.confirm('This will replace your current draft. Continue?')) {
      setBody(proposalTemplate);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [timeout]);

  return (
    <div className="create-post">
      <div className="section-header">
        <h2>Submit New Legislative Proposal</h2>
        <p className="section-description">Propose new legislation that will be immutably recorded on the blockchain for transparent voting</p>
      </div>
      
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="proposal-form">
        <div className="form-actions">
          <button 
            type="button" 
            className="template-button"
            onClick={loadTemplate}
          >
            Load Template
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Proposal Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear, descriptive title for your legislative proposal"
            disabled={isSubmitting}
            maxLength={255}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="body">Proposal Details</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide detailed information about your legislative proposal, including background, purpose, and expected outcomes..."
            disabled={isSubmitting}
            rows={15}
          />
          <div className="markdown-hint">
            Supports Markdown formatting. Use ** for bold, * for italic, # for headers, etc.
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Category Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter comma-separated tags (e.g., governance, finance, healthcare)"
            disabled={isSubmitting}
          />
          <div className="tag-suggestions">
            Suggested categories: {availableCategories.join(', ')}
          </div>
        </div>
        
        <div className="legal-notice">
          <p>
            <strong>IMPORTANT:</strong> By submitting this proposal, you agree that it will be permanently stored on the public blockchain and
            cannot be altered or removed. All voting records will also be immutably recorded.
          </p>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting || !username}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner"></span>
              Submitting Proposal...
            </>
          ) : (
            <>
              <span className="button-icon">📋</span>
              Submit Proposal to Blockchain
            </>
          )}
        </button>
        
        {isSubmitting && (
          <div className="submission-info">
            <p>Waiting for Hive Keychain response. Please check if there's a popup from the Keychain extension.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost; 