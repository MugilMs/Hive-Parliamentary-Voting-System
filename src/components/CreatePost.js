import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const CreatePost = ({ username }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      alert('Please login first');
      return;
    }

    if (!title || !content || !tags) {
      alert('Please fill in all fields');
      return;
    }

    setIsPosting(true);

    try {
      // Format tags properly
      const tagArray = tags.split(' ')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag)
        .slice(0, 5); // Maximum 5 tags allowed
      
      // Ensure we have at least one tag
      if (tagArray.length === 0) {
        tagArray.push('hive');
      }

      // Create a unique permlink
      const permlink = `${Date.now()}-${title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50)}`;

      // Create metadata
      const jsonMetadata = {
        tags: tagArray,
        app: 'hive-explorer/1.0.0',
        format: 'markdown',
        description: content.slice(0, 150) + '...',
        image: []
      };

      const operations = [
        ["comment",
          {
            parent_author: '',
            parent_permlink: tagArray[0],
            author: username,
            permlink: permlink,
            title: title,
            body: content,
            json_metadata: JSON.stringify(jsonMetadata)
          }
        ]
      ];

      // Use requestBroadcast instead of requestPost
      window.hive_keychain.requestBroadcast(
        username,
        operations,
        'posting',
        (response) => {
          if (response.success) {
            alert('Post published successfully!');
            // Clear form
            setTitle('');
            setContent('');
            setTags('');
            setIsPreview(false);
          } else {
            console.error('Post error:', response);
            alert('Failed to publish post: ' + (response.message || 'Unknown error'));
          }
          setIsPosting(false);
        }
      );
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
      setIsPosting(false);
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <div className="create-post-container">
        <div className="markdown-tips">
          <h4>Markdown Tips:</h4>
          <ul>
            <li>**bold text**</li>
            <li>*italic text*</li>
            <li># Heading 1</li>
            <li>## Heading 2</li>
            <li>[Link](url)</li>
            <li>![Image](url)</li>
          </ul>
        </div>

        <div className="editor-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPosting}
                className="title-input"
                maxLength={255}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (max 5)</label>
              <input
                id="tags"
                type="text"
                placeholder="Enter tags separated by spaces (e.g., hive blog life)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={isPosting}
                className="tags-input"
              />
              <small className="tag-hint">First tag will be the main category</small>
            </div>

            <div className="form-group">
              <div className="editor-header">
                <label htmlFor="content">Content</label>
                <button
                  type="button"
                  className="preview-toggle"
                  onClick={() => setIsPreview(!isPreview)}
                  disabled={isPosting}
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              
              {isPreview ? (
                <div className="markdown-preview">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content using Markdown..."
                  disabled={isPosting}
                  className="content-input"
                  rows="15"
                />
              )}
            </div>

            <button 
              type="submit" 
              className="publish-button"
              disabled={isPosting || !title || !content || !tags}
            >
              {isPosting ? (
                <>
                  <span className="loading-spinner"></span>
                  Publishing...
                </>
              ) : (
                'Publish Post'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 