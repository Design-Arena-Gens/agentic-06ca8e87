'use client';

import { format, parseISO } from 'date-fns';

const formatCurrency = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ExpenseList({ expenses, onRemove }) {
  if (!expenses.length) {
    return (
      <section className="panel">
        <header className="panel__header">
          <h2>Recent Expenses</h2>
        </header>
        <div className="empty-state">
          <p>No expenses found for the selected filters. Add a new one to get started!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Recent Expenses</h2>
        <p className="panel__subtitle">Showing the latest transactions that match your filters.</p>
      </header>

      <div className="table__wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Payment</th>
              <th className="table__amount">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{format(parseISO(expense.date), 'MMM d, yyyy')}</td>
                <td>{expense.description || '—'}</td>
                <td>
                  <span className="badge">{expense.category}</span>
                </td>
                <td>{expense.paymentMethod}</td>
                <td className="table__amount">{formatCurrency(expense.amount)}</td>
                <td className="table__actions">
                  <button type="button" className="button button--ghost" onClick={() => onRemove(expense.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
