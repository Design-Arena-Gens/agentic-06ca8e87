'use client';

import { useState } from 'react';
import { format } from 'date-fns';

const CATEGORY_OPTIONS = [
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

const PAYMENT_METHODS = ['Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Digital Wallet'];

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultExpenseState = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  category: 'Groceries',
  paymentMethod: 'Debit Card',
  description: '',
  amount: '',
});

export default function ExpenseForm({ onAdd }) {
  const [formState, setFormState] = useState(defaultExpenseState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsedAmount = parseFloat(formState.amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const payload = {
      id: generateId(),
      date: formState.date,
      category: formState.category,
      paymentMethod: formState.paymentMethod,
      description: formState.description.trim(),
      amount: parsedAmount,
    };

    onAdd(payload);
    setFormState(defaultExpenseState());
  };

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Add Expense</h2>
          <p className="panel__subtitle">Log a new transaction to keep your daily budget up to date.</p>
        </div>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__grid">
          <label className="form__field">
            <span>Date</span>
            <input
              type="date"
              name="date"
              value={formState.date}
              onChange={handleChange}
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </label>

          <label className="form__field">
            <span>Category</span>
            <select name="category" value={formState.category} onChange={handleChange}>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="form__field">
            <span>Payment Method</span>
            <select name="paymentMethod" value={formState.paymentMethod} onChange={handleChange}>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <label className="form__field">
            <span>Description</span>
            <input
              type="text"
              name="description"
              placeholder="Coffee with friends"
              value={formState.description}
              onChange={handleChange}
            />
          </label>

          <label className="form__field">
            <span>Amount</span>
            <div className="form__amount">
              <span>$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="amount"
                placeholder="0.00"
                value={formState.amount}
                onChange={handleChange}
                required
              />
            </div>
          </label>
        </div>

        <div className="form__actions">
          <button type="submit" className="button button--primary">
            Add Expense
          </button>
        </div>
      </form>
    </section>
  );
}
