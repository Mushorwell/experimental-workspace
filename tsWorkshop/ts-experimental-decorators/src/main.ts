import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

const debug = TemplateLiteralLogger.createLog({prefix: '🧐[Typescript Experimental Decorators]:', enabled: true, options: {excludeOutputObject: false, skipPrimitivesIncludedInMessage: false, primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean']}}, 'log');

// Decorator factory
function Logger(logString: string){
  debug`LOGGER FACTORY`
  return function(constructor: Function){
    debug`Logger factory`
    debug`${logString}`
    debug`Template literal must work... ${constructor}`
    console.log(constructor)
    console.log`Template literal blah... ${constructor}`
  }
}

// This will trigger the modified properties of the class before instantiation
// function WithTemplate(template: string, hookId: string){
//   debug`TEMPLATE FACTORY`
//   return function(originalConstructor:any){
//     debug`Rendering template...`
//     const hookEl = document.getElementById(hookId);
//     const p = new originalConstructor()
//     if(hookEl){
//       hookEl.innerHTML = template;
//       hookEl.querySelector('h1')!.textContent = p.name
//     }
//   }

// This triggers the modified properties of the class after instantiation of an object using class
function WithTemplate(template: string, hookId: string){
  debug`TEMPLATE FACTORY`
  return function<T extends {new(...args:any[]):{name: string}}>(originalConstructor:T){
    return class extends originalConstructor {
      constructor(..._:any[]){
        super()
        debug`Rendering template...`
        const hookEl = document.getElementById(hookId);
        const p = new originalConstructor()
        if(hookEl){
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = p.name
        }
      }
    }
  }
}

@Logger('LOGGING PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person{
  name = 'Max';
  constructor(){
    debug`Creating person object...`
  }
}

const person = new Person();
debug`Person created ${person}`

/* Inspecting class with decorators - different places decorators can be placed */
function Log(target: any, propertyName: string | Symbol){
  debug`Property decorator`
  debug`${{target}}`
  debug`${{propertyName}}`
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor){
  debug`Accessor decorator!`
  debug`${{target}}`
  debug`${{name}}`
  debug`${{descriptor}}`
}

function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor){
  debug`Method decorator!`
  debug`${{target}}`
  debug`${{name}}`
  debug`${{descriptor}}`
}

function Log4(target: any, name: string | Symbol, position: number){
  debug`Parameter decorator!`
  debug`${{target}}`
  debug`${{name}}`
  debug`${{position}}`
}

class Product{
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number){
    if(val > 0){
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive')
    }
  }

  constructor(t: string, p: number){
    this.title= t;
    this._price= p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number){
    return this._price * (1*tax)
  }
}

const p1 = new Product('Book', 49.99)
const p2 = new Product('Book 2', 69.99)
debug`${{p1, p2}}`

function Autobind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor){
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    // getter method will be called by the class and therefore 'this' will always refer to that class calling the getter method
    get(){
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor;
}

class Printer {
  message = 'This works!'
  @Autobind
  showMessage(){
    debug`${this.message}`
  }
}

// validating using decorators
const p =  new Printer();
const button = document.querySelector('button');
button?.addEventListener('click', p.showMessage);

interface ValidatorConfig{
  [property: string]: {
    [validatableProp: string]: string[] // i.e. 'required' or 'positive'
  }
}
const registeredValidators: ValidatorConfig = {}
function Required(target: any, propName: string){
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required']
  }
}
function PositiveNumber(target: any, propName: string){
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive']
  }
}
function validate(obj: any){
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig){
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig){
    for (const validator of objValidatorConfig[prop]){
      switch (validator){
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number){
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement; 
  const priceEl = document.getElementById('price') as HTMLInputElement; 

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)){
    alert('Invalid input, please try again!')
    return;
  }
  debug`${{createdCourse}}`
})