import { useState, useCallback } from 'react';
import AddLinkForm from './components/AddLinkForm.jsx';
import DateFilter from './components/DateFilter.jsx';
import LinkList from './components/LinkList.jsx';

const getLocalDateString = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

function App() {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLinkAdded = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">⚡</span>
            Daily Link Tracker
          </h1>
          <p className="app-subtitle">Save and organize your links, one day at a time</p>
        </div>
      </header>

      <main className="app-main">
        <AddLinkForm onLinkAdded={handleLinkAdded} />
        <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <LinkList selectedDate={selectedDate} refreshKey={refreshKey} />
      </main>

      <footer className="app-footer">
        <p>Daily Link Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
