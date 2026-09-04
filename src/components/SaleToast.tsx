'use client';

import { useEffect, useState } from 'react';

const NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Sneha', 'Vikram', 'Meera', 'Arjun', 'Ananya',
  'Karthik', 'Pooja', 'Rahul', 'Neha', 'Aditya', 'Kavita', 'Sanjay', 'Divya',
  'Amit', 'Isha', 'Rajesh', 'Shreya', 'Suresh', 'Ritu', 'Deepak', 'Pallavi',
  'Manish', 'Swati', 'Nikhil', 'Rekha', 'Varun', 'Simran', 'Gaurav', 'Nisha',
  'Tushar', 'Anjali', 'Pankaj', 'Komal', 'Saurabh', 'Tanvi', 'Hemant', 'Jyoti',
];

const STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
  'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Kerala', 'Telangana',
  'Madhya Pradesh', 'Punjab', 'Haryana', 'Bihar', 'Odisha',
  'Jharkhand', 'Chhattisgarh', 'Assam', 'Goa', 'Uttarakhand',
];

const PRODUCTS = [
  'Name & Numerology Report',
  'Career & Relationship Report',
  'Complete Report',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function minutesAgo(): string {
  const m = Math.floor(Math.random() * 28) + 2;
  return `${m} min ago`;
}

export function SaleToast() {
  const [visible, setVisible] = useState(false);
  const [sale, setSale] = useState({ name: '', state: '', product: '', time: '' });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function show() {
      setSale({ name: pick(NAMES), state: pick(STATES), product: pick(PRODUCTS), time: minutesAgo() });
      setVisible(true);
      timeout = setTimeout(() => {
        setVisible(false);
        timeout = setTimeout(show, (45 + Math.random() * 105) * 1000);
      }, 4000);
    }

    timeout = setTimeout(show, 8000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-4 z-50 flex max-w-[340px] items-start gap-3 rounded-lg border border-rule bg-paper px-4 py-3 shadow-lg transition-all duration-500 sm:left-6 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sindoor-wash text-sm font-semibold text-sindoor">
        {sale.name[0]}
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-[13.5px] leading-snug">
          <span className="font-semibold">{sale.name}</span> from {sale.state} purchased
        </p>
        <p className="text-[13px] font-medium text-sindoor">{sale.product}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">{sale.time}</p>
      </div>
    </div>
  );
}
