import { TemplateLiteralLogger } from 'utilities';

const logger = TemplateLiteralLogger.createLoggerHOF({ prefix: '[SetupCounter]: ', enabled: true, minLevel: 'debug', options: {
  type: 'client',
  primitivesAllowedInTemplateString: ['string', 'number', 'boolean', 'bigint'],
  style: {
    color: 'yellow',
  },
  flattenedObjectIndexPrefix: '@',
  flattenedObjectIndexDelimeter: '.',
  excludeOutputObject: false,
  skipPrimitivesIncludedInMessage: false,
}  })


export function setupCounter(element: HTMLButtonElement) {
  logger('log')`Setup counter logger setup`
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(++counter))
  setCounter(0)
}
