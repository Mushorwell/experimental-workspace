import { SiCanonical } from 'react-icons/si';
import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

const logger = TemplateLiteralLogger.createLog({prefix: '🧐[Notes2]:', enabled: true}, 'log');

/* [Intersection types] */
type FileData = {
  path: string;
  content: string;
}

type DatabaseData = {
  connectionUrl: string;
  credentials: string;
}

type Status = {
  isOpen: boolean;
  errorMessage?: string;
}

type AccessedFileData = FileData & Status;
type AccessedDatabaseData = DatabaseData & Status;

const file: AccessedFileData = {
  path: 'file.txt',
  content: 'Hello world',
  isOpen: true
}

// with interfaces
interface FileDataInterface {
  path: string;
  content: string;
}

interface DatabaseDataInterface {
  connectionUrl: string;
  credentials: string;
}

interface StatusInterface {
  isOpen: boolean;
  errorMessage?: string;
}

interface AccessedFileDataInterface extends FileDataInterface, StatusInterface {}
interface AccessedDatabaseDataInterface extends DatabaseDataInterface, StatusInterface {}

const file2: AccessedFileDataInterface = {
  path: 'file.txt',
  content: 'Hello world',
  isOpen: true
}

/* [Type guards] */
type FileSource = { type: 'file', path: string };
const fileSource: FileSource = {
  type: 'file',
  path: 'some/path/to/file.csv',
};

type DBSource = { type: 'db', connectionUrl: string };
const dbSource: DBSource = {
  type: 'db',
  connectionUrl: 'some-connection-url',
};

// discriminated union type property - used to identify the type of an object in this case "type"

type Source = FileSource | DBSource;

function loadDataMethod1(source: Source) {
  // Open + read file OR reach out to database server\
  // Need to first check if the source is a file or database
  if ('path' in source) {
    // source is a file
    logger`Loading file: ${source.path}`;
    return;
  }
  if ('connectionUrl' in source) {
    // source is a database
    logger`Loading database: ${source.connectionUrl}`;
    return;
  }
}

function loadDataMethod2(source: Source) {
  // Open + read file OR reach out to database server
  // Need to first check if the source is a file or database
  if (source.type === 'file') {
    // source is a file
    logger`Loading file: ${source.path}`;
    return;
  }
  if (source.type === 'db') {
    // source is a database
    logger`Loading database: ${source.connectionUrl}`;
    return;
  }
}

class User{
  constructor(public name: string, public age: number) {}
  join(){
    logger`User ${this.name} joined`;
  }
  leave(){
    logger`User ${this.name} left`;
  }
}

class Admin extends User{
  private _permisions: string[];
  constructor(public name: string, public age: number, permissions: string[]) {
    super(name, age);
    this._permisions = permissions;
  }
  scan(){
    logger`Admin ${this.name} has these permissions ${this._permisions}`;
  }
  // override the join method
  join(){
    logger`Admin ${this.name} joined`;
  }
  // override the leave method
  leave(){
    logger`Admin ${this.name} left`;
  }
}

class Admin2{
  private _permisions: string[];
  constructor(public name: string, public age: number, permissions: string[]) {
    this._permisions = permissions;
  }
  scan(){
    logger`Admin ${this.name} has these permissions ${this._permisions}`;
  }
}

const user1 = new User('Tendai', 25);
const admin1 = new Admin('Tendai', 25, ['read', 'write', 'delete']);
const admin2 = new Admin2('Tendai', 25, ['read', 'write', 'delete']);
user1.join();
admin1.join();
user1.leave();
admin1.leave();
admin1.scan();

type Entity = User | Admin;
// cannot properly type guard this using 'instanceof' since Admin extends User so an admin instance is also an instance of a user 
function init(entity: Entity){
  if(entity instanceof User){
    entity.join();
    return;
  }
  // cannot execute any code below here
  // entity.scan();
}

type Entity2 = User | Admin2;
function init2(entity: Entity2){
  if(entity instanceof User){
    entity.join();
    return;
  }
  entity.scan(); // cam execute here
}

// A good way to handle this is to use a type predicate
function isUser(entity: Entity2): entity is User{
  return entity instanceof User;
}

function init3(entity: Entity2){
  if(isUser(entity)){
    entity.join();
    return;
  }
  entity.scan();
}

// !NB: fucntion isUser is known as a type guard

function getLength(value: string | any[]){
  if (typeof value === 'string'){
    const numberOfWords = value.split(' ').length;
    return `${numberOfWords} words`;
  }
  return value.length;
}

const numOfWords = getLength('does not work?');
logger`Number of words: ${numOfWords}`;
// but cannot call this
// const numberOfWords = getLength()

const numOfItems = getLength(['a', 'b', 'c']);
logger`Number of items: ${numOfItems}`;

/* Function overloading example*/
function getLength2(value: any[]): number;
function getLength2(value: string): string;
function getLength2(value: string | any[]){
  if (typeof value === 'string'){
    const numberOfWords = value.split(' ').length;
    return `${numberOfWords} words`;
  }
  return value.length;
}

const numOfWords2 = getLength2('does not work?');
logger`Number of words: ${numOfWords2}`;
logger`Length of string: ${numOfWords2.length}`

const numOfItems2 = getLength2(['a', 'b', 'c']);
logger`Number of items: ${numOfItems2}`;

