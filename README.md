# Institutional Trade Simulator (TradeSim) 🚀

Welcome to **TradeSim**, a high-fidelity, event-driven trading simulator monorepo built using Next.js, Zustand, TailwindCSS, and D3/TradingView widgets. 

It replicates institutional-grade trading mechanics (limit/market orders, slippage, behavioral psychology metrics, live Yahoo Finance market quote tickers) entirely in-memory on the client-side. **No external database is required.**

## 🏗️ Architecture & Core Engines

The project is structured as a modular PNPM monorepo:

### Applications
- `apps/web`: The Next.js 15 primary web application offering interactive dashboards, TradingView widgets, watchlists, portfolio, and transaction books.

### Core Modules (`/packages`)
- `@trade/event-bus`: Reactive, decoupled publish-subscribe bus for all real-time engine metrics.
- `@trade/execution-engine`: Handles limit and market order execution, matching, and slippage calculations.
- `@trade/portfolio-engine`: Real-time position tracking, cost-basis calculations, and PnL monitoring.
- `@trade/risk-engine`: Validates margins and position exposure limits.
- `@trade/signal-engine`: Computes real-time technical indicators (e.g. RSI) and trading triggers.
- `@trade/behavior-engine`: Analyzes trader psychology, cognitive biases (e.g., loss aversion, fear of missing out), and generates real-time advice.
- `@trade/trade-ledger`: Immutable ledger tracking transaction history and audit logs.
- `@trade/simulation-clock`: Deterministic simulation clock controlling ticks and sessions.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18
- PNPM (Recommended)

### Installation
Install all dependencies across the monorepo:
```bash
pnpm install
```

### Running Development Server
Launch the Next.js application:
```bash
pnpm --filter web dev
```
The app will be available on `http://localhost:3000`.

---

## 🚀 Deployment

Because the application uses a decoupled client-side design, you can deploy it as a fully static or serverless site on hosting platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

### Build for Production
To bundle the optimized Next.js app:
```bash
pnpm --filter web build
```

---

## 📜 License
MIT License. Created by LynxTheCoder.
