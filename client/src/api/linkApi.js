const API_BASE = 'https://daily-link-tracker.onrender.com/api' || 'http://localhost:5000/api';
export const addLink = async (url) => {
  const response = await fetch(`${API_BASE}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to add link');
  }
  return data;
};

export const getLinksByDate = async (date) => {
  const tz = new Date().getTimezoneOffset();
  const response = await fetch(`${API_BASE}/links?date=${date}&tz=${tz}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch links');
  }
  return data;
};

export const getActiveDates = async () => {
  const tz = new Date().getTimezoneOffset();
  const response = await fetch(`${API_BASE}/links/dates?tz=${tz}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch active dates');
  }
  return data;
};

export const deleteLink = async (id) => {
  const response = await fetch(`${API_BASE}/links/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete link');
  }
  return data;
};
