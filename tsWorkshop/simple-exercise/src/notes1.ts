import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}

const logger = TemplateLiteralLogger.createLog({prefix: '🧐[Notes1]:', enabled: true}, 'log');
logger`Hello World`;
// ![interesting note...]
// block scoping: let and const are block scoped variables which will not be accessible
// outside scoped
// function someFunc(){
//   let something = 300;
//   const somethingElse = 500;
//   var someOtherThing = 6000;
//   return;
// }

// function checkIfInScope(val: unknown){
//   if(val){
//     logger`Value is ${val}`
//   }
// }

// checkIfInScope(something);
// checkIfInScope(somethingElse);
// checkIfInScope(someOtherThing); // would actually work in normal js

/* [Yet another workshop on classes.... ] */

class User {
  // setup propertes
  name: string;
  age: number;
  constructor(n: string, a: number) {
    // initialize properties
    this.name = n;
    this.age = a;
  }
}

const user = new User('Tendai', 25);
logger`user is ${user}`;

class User2 {
  readonly hobbies: string[] = [];
  // consise way to setup and initialize properties
  constructor(public name: string, private readonly age: number) {}
  greet(){
    logger`Hello, my name is ${this.name} and I am ${this.age} years old.`
  }
  // add a hobby
  addHobby(hobby: string){
    this.hobbies.push(hobby);
  }
  // show hobbies
  showHobbies(){
    logger`Hobbies: ${this.hobbies}`
  }
}

const user2 = new User2('Tendai', 25);
// logger`user2 is ${user2.name} and ${user2.age}`; // age is private
user2.greet()
user2.addHobby('Coding');
user2.addHobby('Gaming');
user2.showHobbies();

/* [Getters and Setters] */
class AnotherUser{
  // firstname and lastname will not be accessible as they are private
  constructor(private firstName: string, private lastName: string){}
  // calculated property
  get fullName(){
    return `${this.firstName} ${this.lastName}`
  }
  set fullName(name: string){
    const [firstName, lastName] = name.split(' ')
    this.firstName = firstName
    this.lastName = lastName
  }
}

const user3 = new AnotherUser('Tendai', 'Makore');
logger`user3 is ${user3.fullName}`;
user3.fullName = 'Tendai Makore';
logger`user3 is ${user3.fullName}`;

/* [validating user details using getters and setters] */
class ValidatedUser{
  protected _firstName: string = '';
  private _lastName: string = '';
  private _age: number = 0;

  set firstName(name: string){
    if(!name || name.trim().length === 0){
      throw new Error('Name is required');
    }
    this._firstName = name;
  }
  set lastName(name: string){
    if(!name || name.trim().length === 0){
      throw new Error('Name is required');
    }
    this._lastName = name;
  }
  set age(age: number){
    if(!age || age < 0){
      throw new Error('Age is required and must be a positive number');
    }
    this._age = age;
  }
  get fullName(){
    return `${this._firstName} ${this._lastName}`
  }
  get age(){
    return this._age
  }
  static eid = 'USER';
  static generateId(){
    return `${ValidatedUser.eid}-${Math.random()}`
  }
}

const user4 = new ValidatedUser();
user4.firstName = 'Tendai';
user4.lastName = 'Makore'; // error will be thrown if firstName, lastName or age are empty
user4.age = 25;
logger`user4 is ${user4.fullName} and is ${user4.age} years old`;

/* [static properties] */
logger`user4 id is ${ValidatedUser.generateId()}`;
logger`user4 eid is ${ValidatedUser.eid}`;

/* [inheritance] */
class Employee extends ValidatedUser{
  constructor(public jobTitle: string){
    super(); // used to access the base class and potentially set properties from the base class
    // super.firstName = 'Tendai';
    /* if there was a constructor in the base class, we would need to call it
      super(firstName, lastName, age);
    */
  }
  // accessing private properties from the base class is not possible, we can only access the properties that are public or protected
  work(){
    // can't access private properties from the base class, but can access protected properties
    logger`Employee ${this._firstName} works`; // a protected property can be accessed by extending classes but cannot be accessed outside classes
  }
}

/* [Abstract classes] - classes that cannot be instantiated, but create a blueprint for other classes */
abstract class UIElement{
  constructor(public identifier: string){
    
  }
  clone(targetLocation: string){
    // abstract method to clone a ui element
  }
}

/* [Inheriting from abstract classes] */
class SideDrawerElement extends UIElement{
  constructor(public identifier: string, public position: 'left' | 'right'){
    super(identifier);
  }
}

/* [Interfaces] - defines a contract for which objects must implement */
interface IAuthenticate {
email: string;
password: string;

login(): void;
logout(): void;
}

// can also use a type to define a shape of an object
type TAuthenticate = {
  email: string;
  password: string;
  login(): void;
  logout(): void;
}

/* [Implementing interface] */
// using an object to implement the interface
let account: TAuthenticate;
account = {
  email: 'user@example.com',
  password: 'password',
  login() {
    logger`User logged in`;
  },
  logout() {
    logger`User logged out`;
  },
};

//  interfaces can be extended i.e. "declaration merging"
interface IAuthenticate {
  // extending the interface
  firstName: string;
  lastName: string;
}

// interfaces can also be used to define functions
interface SumFn {
  (a: number, b: number): number;
}

const sum: SumFn = (a, b) => a + b;

// interfaces can also be used to define classes
class AuthenticatedUser implements IAuthenticate{
 constructor(
  public userName: string,
  public email: string,
  public password: string,
  public firstName: string,
  public lastName: string
 ) {}

 login() {
   logger`User logged in`;
 }

 logout() {
   logger`User logged out`;
 }
}

const user5 = new AuthenticatedUser('Tendai', 'user@example.com', 'password', 'Tendai', 'Makore');
user5.login();
user5.logout();

/* [Extending interfaces] */
interface IAuthenticationAdmin extends IAuthenticate{role: 'admin'|'superadmin'}