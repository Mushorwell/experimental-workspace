/* [Decorators] - decorators are a meta programming feature which is the principle of writing code that will interact with other code */
// decorators are functions that are called when a class is defined
import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

const logger = TemplateLiteralLogger.createLog({prefix: '🧐[Notes6]:', enabled: true, options: {excludeOutputObject: false}}, 'log');

// decorator is a function that is called when a class is defined
function log<T extends new (...args: any[]) => any>(target: T){
  logger`Class ${target.name} is decorated`;
  logger`Class is defined as ${target}`;
  return class extends target{
    constructor(...args: any[]){
      super(...args);
      logger`Class is instantiated`;
      logger`${this}`
    }
  };
}

// decorator to a class method - method decorator
// function autobind(target: any, context: ClassMethodDecoratorContext){
//   logger`Method decorator log`;
//   logger`Autobind ${{target, context}}`;
//   const className = context.kind === 'method' && context.static === false ? context.name : undefined;
//   // context.addInitializer(function(this: any){
//   //   this[context.name] = this[context.name].bind(this);
//   // })
//   if(className){
//     (target as any).prototype[className] = (target as any).prototype[className].bind(target);
//   }
// }
function autobind(target: any, context: ClassMethodDecoratorContext) {
  logger`Method decorator log`;
  logger`Autobind ${{ target, context }}`;
  // context.addInitializer(function (this: any) {
  //   if (context.kind === "method") {
  //     this[context.name] = this[context.name].bind(this);
  //   }
  // });

  return function(this: any){
    logger`Executing original function`;
    logger`${this}`
    target();
    target.apply(this)
  }
}

// function replacer0<T>(initValue: T){
//   return function replacerDecorator(target: undefined, ctx: ClassFieldDecoratorContext){
//     logger`target ${target}`
//     logger`context ${ctx}`

//     return (initialValue: any)=>{
//       logger`Initial value: ${initialValue}`
//       return initValue;
//     }
//   }
// }
function replacer<T>(initValue: T){
  return function replacerDecorator(target: undefined, ctx: ClassFieldDecoratorContext){
    logger`target ${target}`
    logger`context ${ctx}`

    return {
      get() {
        return initValue;
      },
      set(value: any) {
        logger`Setting value: ${value}`;
      }
    };
  }
}

// function replacerDecorator(target: undefined, ctx: ClassFieldDecoratorContext){
//   logger`target ${target}`;
//   logger`context ${ctx}`

//   return (initialValue: any) => {
//     logger`Initial value ${initialValue}`
//     return '';
//   }
// }

@log
class Person{
  @replacer('zzz')
  public name: string = 'Man';
  constructor(name: string){
    this.name = name;
  }
  // @autobind
  greet(){
    logger`Hello, my name is ${this.name}`;
  }
}

const person = new Person('Tendai');
logger`Person is ${person.name}`;
logger`Person is ${person}`;
person.greet();
const greet = person.greet;
logger`${greet}`
// greet(); // autobinding to ensure that the function even when called outside the class will be bound to the class