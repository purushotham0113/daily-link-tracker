function DateFilter({ selectedDate, onDateChange }) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isToday = selectedDate === today;

  return (
    <div className="date-filter" id="date-filter">
      <div className="date-filter-inner">
        <label htmlFor="date-picker" className="date-label">
          <span className="date-icon">📅</span>
          Links for
        </label>
        <input
          id="date-picker"
          type="date"
          className="date-input"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          max={today}
        />
        {!isToday && (
          <button
            id="today-button"
            type="button"
            className="today-button"
            onClick={() => onDateChange(today)}
          >
            Today
          </button>
        )}
      </div>
      <p className="date-display">
        {(() => {
          const [year, month, day] = selectedDate.split('-').map(Number);
          return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        })()}
      </p>
    </div>
  );
}

export default DateFilter;
