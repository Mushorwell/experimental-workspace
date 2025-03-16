import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

const logger = TemplateLiteralLogger.createLog({prefix: '🧐[Notes5]:', enabled: true}, 'log');

/* [typescript typeof operator */
// javascript typeof operator
const userName = 'Tendai';
logger`typeof userName: ${typeof userName}`;

// typescript typeof operator
const userAge = 25;
type UserAge = typeof userAge; // UserAge is the type of 25, since userAge is a const so value will not change

// another example
const settings = {
  difficulty: 'easy',
  minLevel: 3,
  didStart: true,
  players: ['Tendai', 'Makore']
}

// instead of creating a type for an already defined variable which is error prone, can just derive the type from the value
function loadData(data: typeof settings){
  logger`Data loaded: ${data}`;
}

loadData(settings);

// another example
function sum(a: number, b: number) {
  return a + b;
}
function subtract(a: number, b: number) {
  return a - b;
}
 
type SumFn = typeof sum;
type SubtractFn = typeof subtract;


function performMathAction(cb: SumFn | SubtractFn, a: number, b: number) {
  logger`Performing math action with ${cb.name} and ${a} and ${b}: ${cb(a, b)}`;
}

performMathAction(sum, 1, 2);
performMathAction(subtract, 1, 2);

/* Extracting keys with keyof */
type User = {name: string; age: number; }
type UserKeys = keyof User;

let validKey: UserKeys;
validKey = 'name';
validKey = 'age';
// validKey = 'address'; // Error: Type 'address' is not assignable to type 'UserKeys'

// T enforces the type of the object and K enforces the type of the key ensuring that the key exists in the object
function getProp<T extends object, K extends keyof T>(obj: T, key: K){
  const val = obj[key];
  if(val === undefined || val === null){
    throw new Error('Invalid key');
  }
  return val;
}

const user: User = {name: 'Tendai', age: 25};
const name = getProp(user, 'name');
logger`Name: ${name}`;
// const permissions = getProp(user, 'permissions'); // Error: Type 'permissions' is not assignable to type 'UserKeys'

// another example
const data = {id: 5, isStored: true, values: [1, 10, -5], attributes: {title: 'test', description: 'test description'}}
const value = getProp(data, 'attributes'); // ts will know what possible values you can get from the object
logger`Value: ${value}`;

/* indexed access types - for extracting types from other types*/
type AppUser={
  name: string;
  age: number;
  permissions: {
    id: number;
    level: number;
    title: string;
    description: string;
  }[];
}

// this is more efficient than creating another type which makes room for error
type Permissions = AppUser['permissions']; // extracting the permissions type from the AppUser type - permissions array
// to get type of single element in permissions array
type Permission = AppUser['permissions'][number];
// also same as
type Permission2 = Permissions[number];

/* Mapped types */
type Operations = {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
}

type Results<T extends Record<string, (a: number, b: number) => number>> = {
  [K in keyof T]: ReturnType<T[K]>;
}

let mathOperations: Operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

const mathResults: Results<Operations> = {
  add: mathOperations.add(1, 2),
  subtract: mathOperations.subtract(1, 2)
};
logger`Math results: ${mathResults}`;

/* Optional mapping */
type OperationType = Record<string, (a: number, b: number) => number>;
type Optional<T extends OperationType> = {
  [K in keyof T]?: ReturnType<T[K]>;
}

const optional: Optional<Operations> = {
  add: mathOperations.add(1, 2)
};
logger`Optional: ${optional}`;

// remove optional flags
type NotOptional<T extends OperationType> = {
  [K in keyof T]-?: ReturnType<T[K]>;
}

const notOptional: NotOptional<Operations> = {
  add: mathOperations.add(1, 2),
  subtract: mathOperations.subtract(1, 2)
};
logger`Not optional: ${notOptional}`;

/* Readonly mapping */
type Readonly<T extends OperationType> = {
  readonly [K in keyof T]: ReturnType<T[K]>;
}

const readonlyOperations: Readonly<Operations> = {
  add: mathOperations.add(1, 2),
  subtract: mathOperations.subtract(1, 2)
};
logger`Readonly: ${readonlyOperations}`; // cannot modify this object

// removing read only flags
type NotReadonly<T extends OperationType> = {
  -readonly [K in keyof T]: ReturnType<T[K]>;
}

const notReadonly: NotReadonly<Operations> = {
  add: mathOperations.add(1, 2),
  subtract: mathOperations.subtract(1, 2)
};
logger`Not readonly: ${notReadonly}`;
notReadonly.add = 10;
logger`Not readonly after modification: ${notReadonly}`;

/* Template literal types */
const mainUserName = 'Tendai';
const templateLiteralName = `${mainUserName} Makore`; // this is a template literal string

// example
type ReadPermissionsType = 'no-read'| 'read';
type WritePermissionsType = 'no-write'| 'write';

// defining template literal type
type FilePermissionsType = `${ReadPermissionsType}-${WritePermissionsType}`;

type DataFileType = {
  data: string;
  permissions: FilePermissionsType;
}

type DataFileEventNamesType = `${keyof DataFileType}Changed`
type DataFileEventsType = {
  [key in DataFileEventNamesType]: (value: string) => void;
}

/* Conditional types */
type StringArrayType = string[];
type ElementType = StringArrayType[number];
type ElementType2<T extends Array<any>> = T[number];

const array: StringArrayType = ['Tendai', 'Makore'];
const element: ElementType = array[0];
const element2: ElementType2<StringArrayType> = array[0];
logger`Element: ${element}, Element2: ${element2}`;

// another example
type GetElementType<T> = T extends Array<any> ? T[number] : never; // never returns a value when T is anything but an array
type ElementType3 = GetElementType<StringArrayType>;
type ElementType4 = GetElementType<number>;

// example where you need to verify that the object has a certain shape
function getFullName<T extends object>(person: T){
  if ('firstName' in person && 'lastName' in person && person.firstName && person.lastName){
    return `${person.firstName} ${person.lastName}`;
  }
  throw new Error('No person\'s first name and/or last name found')
}
const fullName = getFullName({firstName: 'Tendai', lastName: 'Makore'});
logger`Full name: ${fullName}`;
const fullName2 = getFullName({firstName: 'Tendai', lastName: 'Makore', age: 25});
logger`Full name 2: ${fullName2}`;

// using utility types to verify
type FullNamePersonType = {firstName: string; lastName: string};
type FullNameOrNothingType<T> = T extends FullNamePersonType ? string : never
function getFullName2<T extends object>(person: T): FullNameOrNothingType<T> {
  if ('firstName' in person && 'lastName' in person && person.firstName && person.lastName){
    return `${person.firstName} ${person.lastName}` as FullNameOrNothingType<T>;
  }
  throw new Error('No person\'s first name and/or last name found')
}
const fullName3 = getFullName2({firstName: 'Tendai', lastName: 'Makore'});
logger`Full name 3: ${fullName3}`;
// const fullName4 = getFullName2({lastName: 'Makore', age: 25});
// logger`Full name 4: ${fullName4}`; // will throw error

/* Infer keyword */
function add(a: number, b: number) {
  return a + b;
}

type AddFunctionType = typeof add;
type ReturnValueType<T> = T extends (...args: any[]) => infer R ? R : never;
type AddFunctionReturnValueType = ReturnValueType<AddFunctionType>; // helper type to extract type information from other types
// ReturnValueType is basically how the utility type ReturnType works
