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

## 🚀 Deployment & Live Sites

The application is fully optimized for cloud container platforms like **Railway** and serverless environments like **Vercel** with complete monorepo mapping out-of-the-box.

### 🌐 Live Production URL
* **Railway Deployment:** [tradesimulator.up.railway.app](https://tradesimulator.up.railway.app)
* **Port Bindings:** Dynamically listens on container port `8080` internally and serves standard HTTP/HTTPS.

### ⚙️ Monorepo Cloud Engine Settings
To ensure seamless deployment in CI/CD cloud environments, configure the following setting in your deployment panel:
* **Environment Variable:** `ENABLE_EXPERIMENTAL_COREPACK = 1`
* This automatically enables Node's Corepack and fetches the pinned, stable `pnpm@9.15.2` package manager directly from the registry during builds.

---

## 🔑 Platform & Agent Credentials
For quick reference during integration and developer setup:
* **21st.dev Invite Code:** `myf9rbg2Tc`
* **21st.dev Invite Link:** [Join Platform](https://21st.dev/invite?code=myf9rbg2Tc&source=agents)
* **Platform Auth Token:** `193daa7c8cc2d54030062a2d22ec5b3cfcc33110c38c358d03fc36558fbf0739`

---

## 📜 License
MIT License. Created by LynxTheCoder.

