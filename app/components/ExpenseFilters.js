'use client';

import { format } from 'date-fns';

const CATEGORY_OPTIONS = [
  'All Categories',
  'Groceries',
  'Dining Out',
  'Transport',
  'Housing',
  'Utilities',
  'Health',
  'Entertainment',
  'Shopping',
  'Travel',
  'Education',
  'Other',
];

export default function ExpenseFilters({ filters, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  const handleQuickRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));

    onChange({
      ...filters,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    });
  };

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Filters</h2>
        <div className="filters__quick">
          <button type="button" className="button button--ghost" onClick={() => handleQuickRange(7)}>
            Last 7 days
          </button>
          <button type="button" className="button button--ghost" onClick={() => handleQuickRange(14)}>
            Last 14 days
          </button>
          <button type="button" className="button button--ghost" onClick={() => handleQuickRange(30)}>
            Last 30 days
          </button>
        </div>
      </header>

      <div className="filters__grid">
        <label className="form__field">
          <span>Start Date</span>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        </label>
        <label className="form__field">
          <span>End Date</span>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        </label>
        <label className="form__field">
          <span>Category</span>
          <select name="category" value={filters.category} onChange={handleChange}>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="form__field">
          <span>Payment Method</span>
          <select name="paymentMethod" value={filters.paymentMethod} onChange={handleChange}>
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Digital Wallet">Digital Wallet</option>
          </select>
        </label>
        <label className="form__field filters__search">
          <span>Search</span>
          <input
            type="search"
            name="search"
            placeholder="Search descriptions"
            value={filters.search}
            onChange={handleChange}
          />
        </label>
      </div>
    </section>
  );
}
