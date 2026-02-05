import './globals.css';

export const metadata = {
  title: 'Daily Expense Dashboard',
  description: 'Track daily spending with insights, breakdowns, and trends.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
