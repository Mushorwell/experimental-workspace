import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

const logger = TemplateLiteralLogger.createLog({prefix: '🧐[Notes4]:', enabled: true}, 'log');

/* [Generics] */
let names: Array<string> = ['Tendai', 'Makore']; // using generics to define the type of array
// generic type is a type that can be used to represent a general type of value

// another way to define the same type
let names2: string[] = ['Tendai', 'Makore'];

// creating custom generic type
type DataStore = {
  [key: string]: string | number;
}

let store: DataStore = {};
store['name'] = 'Tendai';
logger`store is ${store}`;
// store.isInstructor = true; Problem when you want to add a property that doesn't match the type defined

// Datastpre generic
type DataStore2<T> = {
  [key: string]: T;
}

let store2: DataStore2<string | number| boolean> = {};
store2['name'] = 'Tendai';
store2['age'] = 25;
store2['isInstructor'] = true;
logger`store2 is ${store2}`;

/* [Generics with functions] */
// we do not know what a and b could actually be - we are just saying that they will be the same type
function merge<T>(a: T, b: T){
  return {a, b};
}

// ts can correctly infer from the params that the return type will be an object {a: number, b: number} 
// no need to specify type explicitly for generic function and return type
const merged = merge(1, 2);
logger`Merged: ${merged}`;

// another example
function createTuple<T, U>(value1: T, value2: U){
  return [value1, value2];
}

// ts can correctly infer from the params that the return type will be an array [number, string]
const tuple = createTuple(1, 'a');
logger`Tuple: ${tuple}`;

// adding constraints to the type parameters
function createTuple2<T extends number, U extends string>(value1: T, value2: U){
  return [value1, value2];
}

const tuple2 = createTuple2(1, 'a');
logger`Tuple2: ${tuple2}`;

// another example
function mergeObject<T extends object, U extends object>(a: T, b: U){
  return {
    ...a,
    ...b
  };
}

const mergedObject = mergeObject({name: 'Tendai'}, {age: 25});
logger`Merged object: ${mergedObject}`;

/* [Generics with classes] */
class User<T extends number | string>{
  constructor(public id: T) {}
  join(){
    logger`User ${this.id} joined`;
  }
  leave(){
    logger`User ${this.id} left`;
  }
}

const user1 = new User(1);
const user2 = new User('1');
user1.join();
user2.join();
user1.leave();
user2.leave();

/* [Generics with interfaces] */
interface User2<T extends number | string>{
  id: T;
  join(): void;
  leave(): void;
}

const user3: User2<number> = {
  id: 1,  
  join(){
    logger`User ${this.id} joined`;
  },
  leave(){
    logger`User ${this.id} left`;
  }
};

const user4: User2<string> = {
  id: '1',
  join(){
    logger`User ${this.id} joined`;
  },
  leave(){
    logger`User ${this.id} left`;
  }
};

user3.join();
user4.join();
user3.leave();
user4.leave();