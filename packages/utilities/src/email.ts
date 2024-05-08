export function maskEmail(emailAddress: string): string {
  return emailAddress.replace(
    /^(.)(.*)(@.*)$/,
    (fullEmailAddress, firstCharacter, middleCharacters, emailDomain) => {
      const maskedMiddleCharacters = '*'.repeat(middleCharacters.length);
      return `${firstCharacter}${maskedMiddleCharacters}${emailDomain}`;
    }
  );
}