'use client';

import { Portfolio } from '@/components/dashboard/Portfolio';

export default function PortfolioPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Track your open positions and performance metrics across deterministic simulation cycles.</p>
        </div>
        <Portfolio />
      </div>
    </div>
  );
}
