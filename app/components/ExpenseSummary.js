'use client';

import { format, isToday, isThisMonth, parseISO } from 'date-fns';

const formatCurrency = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ExpenseSummary({ expenses }) {
  const totals = expenses.reduce(
    (accumulator, expense) => {
      const expenseDate = parseISO(expense.date);
      const amount = expense.amount;

      accumulator.total += amount;
      accumulator.byCategory[expense.category] = (accumulator.byCategory[expense.category] || 0) + amount;

      if (isToday(expenseDate)) {
        accumulator.today += amount;
      }

      if (isThisMonth(expenseDate)) {
        accumulator.month += amount;
      }

      return accumulator;
    },
    {
      total: 0,
      today: 0,
      month: 0,
      byCategory: {},
    },
  );

  const leadingCategory = Object.entries(totals.byCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }))[0];

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Spending Overview</h2>
          <p className="panel__subtitle">Stay on top of your daily spending habits with up-to-date insights.</p>
        </div>
        <div className="summary__date">{format(new Date(), "EEEE, MMMM d")}</div>
      </header>

      <div className="summary__grid">
        <div className="summary__card">
          <p>Today&apos;s Spend</p>
          <strong>{formatCurrency(totals.today)}</strong>
        </div>
        <div className="summary__card">
          <p>This Month</p>
          <strong>{formatCurrency(totals.month)}</strong>
        </div>
        <div className="summary__card">
          <p>All Time Total</p>
          <strong>{formatCurrency(totals.total)}</strong>
        </div>
        <div className="summary__card">
          <p>Top Category</p>
          {leadingCategory ? (
            <strong>
              {leadingCategory.category}
              <span>{formatCurrency(leadingCategory.amount)}</span>
            </strong>
          ) : (
            <strong>—</strong>
          )}
        </div>
      </div>
    </section>
  );
}
