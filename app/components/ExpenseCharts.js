'use client';

import { useMemo } from 'react';
import { parseISO, format } from 'date-fns';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const palette = ['#2563eb', '#ec4899', '#22c55e', '#f97316', '#a855f7', '#10b981', '#f59e0b'];

const buildDailyDataset = (expenses) => {
  const grouped = expenses.reduce((accumulator, expense) => {
    const dayKey = expense.date;
    accumulator[dayKey] = (accumulator[dayKey] || 0) + expense.amount;
    return accumulator;
  }, {});

  const keys = Object.keys(grouped).sort((a, b) => parseISO(a) - parseISO(b));

  return {
    labels: keys.map((key) => format(parseISO(key), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Spend',
        data: keys.map((key) => Number(grouped[key].toFixed(2))),
        backgroundColor: '#2563eb30',
        borderColor: '#2563eb',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };
};

const buildCategoryDataset = (expenses) => {
  const grouped = expenses.reduce((accumulator, expense) => {
    accumulator[expense.category] = (accumulator[expense.category] || 0) + expense.amount;
    return accumulator;
  }, {});

  const entries = Object.entries(grouped).sort(([, a], [, b]) => b - a);

  return {
    labels: entries.map(([category]) => category),
    datasets: [
      {
        data: entries.map(([, amount]) => Number(amount.toFixed(2))),
        backgroundColor: entries.map((_, index) => palette[index % palette.length]),
        borderWidth: 0,
      },
    ],
  };
};

export default function ExpenseCharts({ expenses }) {
  const dailyDataset = useMemo(() => buildDailyDataset(expenses), [expenses]);
  const categoryDataset = useMemo(() => buildCategoryDataset(expenses), [expenses]);

  if (!expenses.length) {
    return null;
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Spending Trends</h2>
        <p className="panel__subtitle">Compare daily totals and see how each category contributes.</p>
      </header>

      <div className="charts__grid">
        <div className="chart__card">
          <h3>Daily Spending</h3>
          <Bar
            data={dailyDataset}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `$${context.parsed.y.toFixed(2)}` } },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value}`,
                  },
                },
              },
            }}
          />
        </div>
        <div className="chart__card">
          <h3>By Category</h3>
          <Doughnut
            data={categoryDataset}
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 14,
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      return `${label}: $${value.toFixed(2)}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}
