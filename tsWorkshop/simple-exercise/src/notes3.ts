import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

const logger = TemplateLiteralLogger.createLog({prefix: '🧐[Notes3]:', enabled: true}, 'log');
/* [Index types] */
type DataStore = {
  // defining a type that can be later defined by other implementations
  [key: string]: string | number;
}

// using Record keyword
type DataStore2 = Record<string, string|number>;

/* with index types, can dynamically type objects that are not immediately defined*/
let store: DataStore = {};

// some code....
store['name'] = 'Tendai';
logger`store is ${store}`;

store = {
  ...store,
  'age': 25,
  'address': '123 Main St'
}

logger`store is now ${store}`;

/* with Record type */
let store2: DataStore2 = {}
store2['name'] = 'Tendai';
logger`store2 is ${store2}`;

store2 = {
  ...store2,
  'age': 25,
  'address': '123 Main St'
}

logger`store2 is now ${store2}`;

/* [Constant types - const] */
let roles = ['admin', 'user', 'guest']; // infers string[]
let roles2 = ['admin', 'user', 'guest'] as const; // infers readonly string[]

// NOTE: Readonly arrays cannot be edited - cannot push, pop, shift, unshift, etc

/* [ satisfies keyword ] */
let roles3 = ['admin', 'user', 'guest'] as const;
const firstRole = roles3[0];

const dataEntries: Record<string, number> = {
  entry1: 0.26,
  entry2: 0.32,
  entry3: -.42
}

// Note: with this type you can still try and access values that don't exist
dataEntries['entry4'] = 0.55;

// With satisfies
const dataEntries2 = {
  entry1: 0.26,
  entry2: 0.32,
  entry3: -.42
} satisfies Record<string, number>;
// dataEntries2['entry4'] = 0.55; // Error: Property 'entry4' does not exist on type 'Record<string, number> 
// with satisfies - the actual type is inferred based on the defined values and not based on the general or inferred type