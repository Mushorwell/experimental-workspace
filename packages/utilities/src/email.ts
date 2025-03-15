import { TemplateLiteralLogger } from './templateLiteralLogger';

const logger = TemplateLiteralLogger.createLog({ prefix: '[MaskEmail]: ', enabled: true, minLevel: 'debug', options: {
  type: 'client',
  primitivesAllowedInTemplateString: ['string', 'number', 'boolean', 'bigint'],
  style: {
    color: 'green',
  },
  tableIndexPrefix: '@',
  tableIndexDelimeter: '.',
  excludeOutputObject: false,
  skipPrimitivesIncludedInMessage: false,
}  }, 'log');

export function maskEmail(emailAddress: string): string {
  return emailAddress.replace(
    /^(.)(.*)(@.*)$/,
    (fullEmailAddress, firstCharacter, middleCharacters, emailDomain) => {
      logger`full email address - ${fullEmailAddress}`;
      const maskedMiddleCharacters = '*'.repeat(middleCharacters.length);
      return `${firstCharacter}${maskedMiddleCharacters}${emailDomain}`;
    }
  );
}