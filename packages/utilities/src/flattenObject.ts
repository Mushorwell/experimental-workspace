import {
  forEachIndexed,
  forEachObjIndexed,
  includes,
  is,
  isNil,
  type,
} from 'rambdax';
// import { DebugLogger } from './debugLogger';
type PrimitiveOrException =
  | string
  | number
  | bigint
  | undefined
  | null
  | ((...args: any[]) => any);
type NestedObject = { [key: string]: any };
interface FlattenedObject {
  [key: string]: PrimitiveOrException;
}
// const logger = new DebugLogger({ prefix: '[FlattenObject]' });
export const flattenObjectWithArrays = (
  obj: NestedObject,
  options: {
    delimiter?: string;
    prefix?: string;
  } = { delimiter: '.', prefix: '' }
): FlattenedObject => {
  const { delimiter, prefix } = options;
  const result: FlattenedObject = {};

  const isPrimitiveOrException = (value: any): value is PrimitiveOrException =>
    includes(type(value), [
      'String',
      'Number',
      'BigInt',
      'Undefined',
      'Null',
      'Function',
    ]);

  const flatten = (currentObj: any, currentPath = '') => {
    // if (debug) {
    //   logger.debug`Processing path, ${currentPath}, ${currentObj}`;
    // }

    if (isPrimitiveOrException(currentObj)) {
      result[currentPath] = currentObj;
      // if (debug) {
      //   logger.info`Added primitive or exception, ${currentPath}, ${currentObj}`;
      // }
      return;
    }

    if (is(Array, currentObj)) {
      forEachIndexed((value, index) => {
        flatten(value, `${currentPath}[${index}]`);
      }, currentObj as any[]);
    } else if (is(Object, currentObj) && !isNil(currentObj)) {
      forEachObjIndexed((value, key) => {
        const newPath = currentPath
          ? `${currentPath}${delimiter}` + String(key)
          : String(key);
        flatten(value, newPath);
      }, currentObj);
    }
    // else if (debug) {
    //   logger.debug`Skipped non-primitive value, ${currentPath}, ${currentObj}`;
    // }
  };

  flatten(obj, prefix);
  return result;
};

export function TestFlattenObject() {
  const foo = {
    bar: 'foo',
    baz: {
      fizz: 'buzz',
      a: {
        b: 100,
        c: false,
      },
    },
  };

  const adam = ['man', ['woman', 'child']];

  const simple = { a: 1, b: 2, c: 4 };

  const simpleArr = [1234, 5678, 9876];

  console.log(flattenObjectWithArrays(foo));
  console.log(flattenObjectWithArrays(adam));
  console.log(flattenObjectWithArrays(simple));
  console.log(flattenObjectWithArrays(simpleArr));
}
// TestFlattenObject();
