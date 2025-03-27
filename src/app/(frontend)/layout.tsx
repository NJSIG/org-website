import { Footer } from '@/globals/Footer/Component';
import React from 'react';
import './styles.css';

export const metadata = {
  description:
    'New Jersey Schools Insurance Group is a member owned and controlled non-profit public entity focused on keeping dollars in New Jersey classrooms since 1983.',
  title: 'NJSIG | Keeping Dollars in the Classroom',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
