import { setupCounter } from '../lib/main';
import './style.css';
import typescriptLogo from './typescript.svg';
// import { TemplateLiteralLogger}
import { calculateInvestment, InvestmentData, printResult } from '../lib/calculator';

const investmentData: InvestmentData = {
  initialAmount: 100000,
  annualContribution: 100000,
  expectedReturn: 0.05,
  duration: 10
}
const results = calculateInvestment(investmentData)

printResult(results)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
