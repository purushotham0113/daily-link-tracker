import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { deleteLink } from '../api/linkApi.js';

function LinkItem({ link, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const time = new Date(link.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteLink(link._id);
      if (onDeleted) onDeleted(link._id);
    } catch (err) {
      console.error('Delete failed:', err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className={`link-item ${isDeleting ? 'deleting' : ''}`} id={`link-${link._id}`}>
      <div className="link-left">
        <span className="link-icon">🔗</span>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-url"
          title={link.url}
        >
          {link.url}
        </a>
      </div>
      <div className="link-right">
        <span className="link-time">{time}</span>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="open-button"
          id={`open-${link._id}`}
        >
          Open ↗
        </a>
        <button
          className="delete-button"
          id={`delete-${link._id}`}
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete link"
          aria-label="Delete link"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default LinkItem;
