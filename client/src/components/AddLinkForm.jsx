import { useState } from 'react';

function AddLinkForm({ onLinkAdded }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidUrl = (str) => {
    try {
      const urlToTest = /^https?:\/\//i.test(str) ? str : `https://${str}`;
      new URL(urlToTest);
      return urlToTest.length > 10;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      const { addLink } = await import('../api/linkApi.js');
      await addLink(trimmed);
      setUrl('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      if (onLinkAdded) onLinkAdded();
    } catch (err) {
      setError(err.message || 'Failed to add link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-link-bar">
      <form onSubmit={handleSubmit} className="add-link-form" id="add-link-form">
        <div className="input-wrapper">
          <span className="input-icon">🔗</span>
          <input
            id="url-input"
            type="text"
            className="url-input"
            placeholder="Paste a link here..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
        <button
          id="add-link-button"
          type="submit"
          className={`add-button ${success ? 'success' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner" />
          ) : success ? (
            '✓ Added'
          ) : (
            'Add Link'
          )}
        </button>
      </form>
      {error && <p className="form-error" id="form-error">{error}</p>}
    </div>
  );
}

export default AddLinkForm;
