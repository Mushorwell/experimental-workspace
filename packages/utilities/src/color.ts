import { TemplateLiteralLogger } from './templateLiteralLogger';

const logger = new TemplateLiteralLogger({ prefix: '[Colors]: ', enabled: true, minLevel: 'debug', options: {
  type: 'client',
  primitivesAllowedInTemplateString: ['string', 'number', 'boolean', 'bigint'],
  style: {
    color: 'magenta',
  },
  tableIndexPrefix: '@',
  tableIndexDelimeter: '.',
  excludeOutputObject: false,
  skipPrimitivesIncludedInMessage: false,
}  });

interface IRgbObj {
  red: number;
  green: number;
  blue: number;
}

const fillHexValArr = (hexValArr: string[]) => {
  const arr: Array<string> = [];
  for (let i = 0; i < 7 - hexValArr.length; i++) {
    arr.push(hexValArr[hexValArr.length - 1]);
  }
  return arr;
};

const handleRgba = (rgbaString: string): IRgbObj => {
  const [redString, greenString, blueString, alphaValue] = rgbaString
    .slice(5, -1)
    .split(',');
  logger.log`Alpha value : ${alphaValue}`;
  return {
    red: JSON.parse(redString),
    green: JSON.parse(greenString),
    blue: JSON.parse(blueString),
  };
};

const handleRgb = (rgbString: string): IRgbObj => {
  const [redString, greenString, blueString] = rgbString
    .slice(4, -1)
    .split(',');
  return {
    red: JSON.parse(redString),
    green: JSON.parse(greenString),
    blue: JSON.parse(blueString),
  };
};

const colorToHex = (color: number): string => {
  const hexColor = color.toString(16);
  return hexColor.length < 2 ? '0' + hexColor : hexColor;
};

export const hexToRgb = (color: string): IRgbObj => {
  // handle non-hexadecimal color strings
  if (color.slice(0, 4) === 'rgba') return handleRgba(color);
  if (color.slice(0, 3) === 'rgb') return handleRgb(color);
  if (color[0] !== '#') return { red: 0, green: 0, blue: 0 };
  // handle hexadecimal color strings
  const hexValArr = color[0] === '#' ? [...color] : ['#', color];
  const hex: string =
    color.length === 7
      ? color
      : [...hexValArr, ...fillHexValArr(hexValArr)].join('');
  return {
    red: parseInt(hex[1] + hex[2], 16),
    green: parseInt(hex[3] + hex[4], 16),
    blue: parseInt(hex[5] + hex[6], 16),
  };
};

export const rgbToHex = (color: string): string => {
  // handle hexadecimal color strings and non-rgb strings
  if (color[0] === '#') return color;
  if (color.slice(0, 3) !== 'rgb') return '#000';
  let colorObj: IRgbObj;
  // split rgb/rgba color into color object
  color.slice(0, 4) === 'rgba'
    ? (colorObj = handleRgba(color))
    : (colorObj = handleRgb(color));
  // concatenate the rgb base 16 colors from the
  return (
    '#' +
    colorToHex(colorObj.red) +
    colorToHex(colorObj.green) +
    colorToHex(colorObj.blue)
  );
};
