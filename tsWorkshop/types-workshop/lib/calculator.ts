/* 
data: 
- initial amount
- annual contribution
- expected return
- duration
*/
import { TemplateLiteralLogger } from 'utilities';

const logger = new TemplateLiteralLogger({ prefix: '[Calculator]: ', enabled: true, minLevel: 'debug', options: {
  type: 'client',
  primitivesAllowedInTemplateString: ['string', 'number', 'boolean', 'bigint'],
  style: {
    color: 'green',
  },
  flattenedObjectIndexPrefix: '@',
  flattenedObjectIndexDelimeter: '.',
  excludeOutputObject: false,
  skipPrimitivesIncludedInMessage: false,
}  })

export type InvestmentData = {
  initialAmount: number;
  annualContribution: number;
  expectedReturn: number;
  duration: number;
}

type InvestmentResult = {
  finalAnnualAmount: number;
  year: string;
  totalContributions: number;
  totalInterestEarned: number;
}

export type CalculationResult = InvestmentResult[] | string

export function calculateInvestment(data: InvestmentData): CalculationResult {
  const { initialAmount, annualContribution, expectedReturn, duration } = data;
  if(initialAmount < 0) return 'Initial amount must be at least 0'
  if (duration < 1) return 'Duration must be greater than 0'
  if (annualContribution < 0) return 'Annual contribution must be at least 0'
  if (expectedReturn < 0) return 'Expected return must be at least 0'
  
  let total = initialAmount;
  let totalContributions = 0;
  let totalInterestEarned = 0;

  const annualResults: InvestmentResult[] = [];

  for (let year = 0; year < duration; year++) {
    total = total * (1 + expectedReturn);
    totalInterestEarned =total - totalContributions - initialAmount;
    totalContributions += annualContribution;
    total += annualContribution;

    annualResults.push({
      year: `Year ${year + 1}`,
      finalAnnualAmount: total,
      totalContributions,
      totalInterestEarned
    })
  }

  return annualResults;
}

export function printResult(result: CalculationResult) {
  if (typeof result === 'string') {
    logger.log`Could not calculate: ${result}`
    return;
  }
  
  result.forEach((result) => {
    logger.log`Year: ${result.year}`
    logger.log`Final annual amount: ${result.finalAnnualAmount.toFixed(2)}`
    logger.log`Total contributions: ${result.totalContributions.toFixed(2)}`
    logger.log`Total interest earned: ${result.totalInterestEarned.toFixed(2)}`
    logger.log`============================================`
  })
  
  logger.log`Summary: `
  logger.log`---------------------------------------------`
  logger.log`Final annual amount: ${result[result.length - 1].finalAnnualAmount.toFixed(2)}`
  logger.log`Total contributions: ${result[result.length - 1].totalContributions.toFixed(2)}`
  logger.log`Total interest earned: ${result[result.length - 1].totalInterestEarned.toFixed(2)}`

  logger.table`${result}`
}

const investmentData: InvestmentData = {
  initialAmount: 5000,
  annualContribution: 500,
  expectedReturn: 0.05,
  duration: 10
}
const results = calculateInvestment(investmentData)

printResult(results)