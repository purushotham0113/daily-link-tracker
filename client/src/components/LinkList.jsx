import { useState, useEffect } from 'react';
import { getLinksByDate } from '../api/linkApi.js';
import LinkItem from './LinkItem.jsx';

function LinkList({ selectedDate, refreshKey }) {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchLinks = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await getLinksByDate(selectedDate);
        if (!cancelled) {
          setLinks(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load links');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    fetchLinks();
    return () => { cancelled = true; };
  }, [selectedDate, refreshKey]);

  if (isLoading) {
    return (
      <div className="link-list-status" id="loading-state">
        <div className="loading-dots">
          <span></span><span></span><span></span>
        </div>
        <p>Loading links...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="link-list-status error" id="error-state">
        <span className="status-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="link-list-status empty" id="empty-state">
        <span className="status-icon">📭</span>
        <p>No links added on this date</p>
      </div>
    );
  }

  const handleDeleted = (id) => {
    setLinks((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <div className="link-list" id="link-list">
      <p className="link-count">{links.length} link{links.length !== 1 ? 's' : ''}</p>
      {links.map((link) => (
        <LinkItem key={link._id} link={link} onDeleted={handleDeleted} />
      ))}
    </div>
  );
}

export default LinkList;
