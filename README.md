# quantkit.js

**A lightweight quantitative finance and portfolio analytics library for JavaScript.**

`quantkit.js` provides essential tools for quantitative analysis, financial calculations, and portfolio performance evaluation — all through a simple, developer-friendly JavaScript API. Zero runtime dependencies.

---

## Features

- **Performance Metrics** — Sharpe ratio, Sortino ratio, Calmar ratio, information ratio, CAGR.
- **Risk Analytics** — Volatility, maximum drawdown, beta, downside deviation, historical VaR and expected shortfall.
- **Statistical Analysis** — Mean, median, variance, standard deviation, covariance, correlation, quantiles.
- **Time Series Analysis** — Rolling mean, sum, standard deviation and volatility; simple, log and cumulative returns.
- **Portfolio Analytics** — Portfolio returns, covariance/correlation matrices, portfolio volatility, risk contributions.
- **Technical Indicators** — SMA, EMA, RSI, MACD.

## Installation

```bash
npm install quantkit
```

or

```bash
yarn add quantkit
```

Requires Node.js 18+. The package is ESM-only.

## Quick Start

```javascript
import { sharpeRatio, maxDrawdown, volatility } from "quantkit";

const returns = [0.02, -0.01, 0.035, 0.012, -0.02, 0.04, 0.015];

const sharpe = sharpeRatio(returns, { riskFreeRate: 0.06, periodsPerYear: 252 });
const drawdown = maxDrawdown(returns);
const vol = volatility(returns, { periodsPerYear: 252 });

console.log({ sharpe, drawdown, vol });
```

You can also import only the module you need:

```javascript
import { rsi, macd } from "quantkit/indicators";
```

## Conventions

- **Returns are simple returns as decimals** (`0.02` = 2%), in chronological order.
- **`periodsPerYear`** defaults to `252` (daily data). Use `12` for monthly, `52` for weekly, `1` for no annualization.
- **`riskFreeRate`** is an *annual* rate; it is converted to a per-period rate as `rf / periodsPerYear`.
- **Standard deviation / variance / covariance** use the sample (n − 1) estimator by default; pass `{ sample: false }` for population.
- **`maxDrawdown`** is returned as a non-positive fraction (`-0.2` = 20% drawdown).
- **`valueAtRisk` / `expectedShortfall`** are returned as positive loss fractions.
- Rolling functions and indicators return arrays the same length as the input, padded with `NaN` until enough data exists.
- Invalid input (non-arrays, `NaN`, mismatched lengths) throws a `TypeError` or `RangeError`.

## API

### Statistics
`sum`, `mean`, `median`, `variance`, `standardDeviation`, `covariance`, `correlation`, `quantile`

### Returns
`simpleReturns(prices)`, `logReturns(prices)`, `cumulativeReturns(returns)`, `totalReturn(returns)`

### Risk
`volatility`, `downsideDeviation`, `drawdownSeries`, `maxDrawdown`, `beta`, `valueAtRisk`, `expectedShortfall`

### Performance
`cagr`, `sharpeRatio`, `sortinoRatio`, `calmarRatio`, `informationRatio`

### Time Series
`rolling(values, window, fn)`, `rollingSum`, `rollingMean`, `rollingStd`, `rollingVolatility`

### Portfolio
`portfolioReturns(assetReturns, weights)`, `covarianceMatrix`, `correlationMatrix`, `portfolioVariance`, `portfolioVolatility`, `riskContributions`, `normalizeWeights`, `equalWeights`

```javascript
import { portfolioReturns, covarianceMatrix, portfolioVolatility, riskContributions } from "quantkit";

const assets = [
  [0.01, 0.02, -0.01, 0.015], // asset A
  [0.005, -0.01, 0.02, 0.01], // asset B
];
const weights = [0.6, 0.4];

const cov = covarianceMatrix(assets);
console.log(portfolioReturns(assets, weights));
console.log(portfolioVolatility(weights, cov));
console.log(riskContributions(weights, cov));
```

### Technical Indicators
`sma`, `ema`, `rsi(prices, period = 14)`, `macd(prices, { fast = 12, slow = 26, signal = 9 })`

## Modules

| Module | Description | Status |
|---|---|---|
| Descriptive Statistics | Mean, variance, standard deviation | Available |
| Returns | Simple and logarithmic returns | Available |
| Risk Metrics | Volatility, drawdown, downside deviation, VaR | Available |
| Performance Metrics | Sharpe, Sortino, Calmar, CAGR | Available |
| Statistical Analysis | Covariance, correlation, beta | Available |
| Time Series | Rolling mean, rolling volatility | Available |
| Portfolio Analytics | Portfolio returns and risk | Available |
| Technical Indicators | RSI, MACD, moving averages | Available |

## Design Philosophy

- **Lightweight:** No runtime dependencies.
- **JavaScript-first:** Designed for the JavaScript ecosystem.
- **Mathematically sound:** Calculations follow well-defined conventions, documented above and covered by tests.
- **Developer-friendly:** Simple APIs, predictable inputs, clear error messages.
- **Modular:** Import only the functionality you need.

## Development

```bash
npm install
npm test
```

Tests use [Vitest](https://vitest.dev).

## Roadmap

- [x] Establish core library architecture.
- [x] Implement descriptive statistical functions.
- [x] Implement return calculations.
- [x] Add risk and performance metrics.
- [x] Add time-series functionality.
- [x] Introduce portfolio analytics.
- [x] Add comprehensive unit tests.
- [ ] Publish the first stable npm release.
- [ ] Add TypeScript type definitions.
- [ ] Expand documentation with mathematical explanations and examples.

## Contributing

Contributions, suggestions, bug reports, and feature requests are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Add tests for new functionality.
5. Submit a pull request.

Please ensure that financial calculations are accompanied by appropriate tests and mathematical references.

## Disclaimer

This library is for educational and analytical purposes and is not financial advice.

## License

MIT

---

**Built for developers exploring quantitative finance with JavaScript.**

If you find quantkit.js useful, consider giving the repository a ⭐ on GitHub.
