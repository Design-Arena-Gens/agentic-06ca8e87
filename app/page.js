'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseList from './components/ExpenseList';
import ExpenseCharts from './components/ExpenseCharts';

const STORAGE_KEY = 'agentic-expense-dashboard:v1';

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createSeedExpenses = () => {
  const today = new Date();
  const days = [0, 1, 2, 3, 4, 5, 6, 8, 10, 14];
  const sample = [
    {
      category: 'Groceries',
      amount: 54.23,
      description: 'Produce market run',
      paymentMethod: 'Debit Card',
    },
    {
      category: 'Transport',
      amount: 18.5,
      description: 'Ride share to office',
      paymentMethod: 'Digital Wallet',
    },
    {
      category: 'Dining Out',
      amount: 27.4,
      description: 'Team lunch',
      paymentMethod: 'Credit Card',
    },
    {
      category: 'Utilities',
      amount: 92.13,
      description: 'Electric bill',
      paymentMethod: 'Bank Transfer',
    },
    {
      category: 'Health',
      amount: 36.9,
      description: 'Pharmacy run',
      paymentMethod: 'Debit Card',
    },
    {
      category: 'Entertainment',
      amount: 15.99,
      description: 'Streaming subscription',
      paymentMethod: 'Credit Card',
    },
    {
      category: 'Groceries',
      amount: 82.75,
      description: 'Weekly grocery haul',
      paymentMethod: 'Credit Card',
    },
    {
      category: 'Transport',
      amount: 45.0,
      description: 'Monthly transit pass',
      paymentMethod: 'Debit Card',
    },
    {
      category: 'Shopping',
      amount: 68.22,
      description: 'Household supplies',
      paymentMethod: 'Debit Card',
    },
    {
      category: 'Health',
      amount: 120.0,
      description: 'Annual checkup copay',
      paymentMethod: 'Credit Card',
    },
  ];

  return sample.map((expense, index) => {
    const date = subDays(today, days[index]);
    return {
      id: generateId(),
      date: format(date, 'yyyy-MM-dd'),
      createdAt: date.toISOString(),
      ...expense,
    };
  });
};

const initialFilters = () => {
  const today = new Date();
  const start = subDays(today, 13);

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(today, 'yyyy-MM-dd'),
    category: 'All Categories',
    paymentMethod: 'All',
    search: '',
  };
};

export default function HomePage() {
  const [expenses, setExpenses] = useState(() => createSeedExpenses());
  const [filters, setFilters] = useState(() => initialFilters());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const payload = JSON.parse(stored);
        if (Array.isArray(payload.expenses)) {
          setExpenses(payload.expenses);
        } else {
          setExpenses(createSeedExpenses());
        }
      } catch (error) {
        console.error('Failed to parse saved expenses', error);
        setExpenses(createSeedExpenses());
      }
    } else {
      setExpenses(createSeedExpenses());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        expenses,
      }),
    );
  }, [expenses, hydrated]);

  const handleAddExpense = (expense) => {
    setExpenses((prev) => {
      const next = [
        {
          ...expense,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
      return next.sort((a, b) => {
        const aTime = new Date(a.date + 'T00:00:00').getTime();
        const bTime = new Date(b.date + 'T00:00:00').getTime();
        if (aTime !== bTime) {
          return bTime - aTime;
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
    });
  };

  const handleRemoveExpense = (expenseId) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
  };

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const expenseDate = parseISO(expense.date);
        if (filters.startDate) {
          const start = parseISO(filters.startDate);
          if (expenseDate < start) {
            return false;
          }
        }
        if (filters.endDate) {
          const end = parseISO(filters.endDate);
          if (expenseDate > end) {
            return false;
          }
        }
        if (filters.category !== 'All Categories' && expense.category !== filters.category) {
          return false;
        }
        if (filters.paymentMethod !== 'All' && expense.paymentMethod !== filters.paymentMethod) {
          return false;
        }
        if (filters.search && !expense.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aTime = new Date(a.date + 'T00:00:00').getTime();
        const bTime = new Date(b.date + 'T00:00:00').getTime();
        if (aTime !== bTime) {
          return bTime - aTime;
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [expenses, filters]);

  return (
    <main className="layout">
      <section className="layout__intro">
        <h1>Daily Expense Dashboard</h1>
        <p>
          Track every purchase, understand your spending habits, and hit your savings goals with real-time
          insights.
        </p>
      </section>

      <ExpenseSummary expenses={expenses} />

      <div className="layout__grid">
        <ExpenseForm onAdd={handleAddExpense} />
        <ExpenseFilters filters={filters} onChange={setFilters} />
      </div>

      <ExpenseCharts expenses={filteredExpenses} />

      <ExpenseList expenses={filteredExpenses} onRemove={handleRemoveExpense} />
    </main>
  );
}
