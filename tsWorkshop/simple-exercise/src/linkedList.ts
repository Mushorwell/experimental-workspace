import { TemplateLiteralLogger } from '../../../packages/utilities/src/templateLiteralLogger';

const logger = TemplateLiteralLogger.createLog({prefix: '🧐[LinkedList]:', enabled: true}, 'log');

class ListNode<T>{
  next?: ListNode<T>;
  constructor(public value: T){}
}

class LinkedList<T>{
  private root?: ListNode<T>;
  private _length = 0;
  private tail?: ListNode<T>;
  
  add(value: T){const node = new ListNode<T>(value);
    if (!this.root || !this.tail){this.root = node; this.tail = node; this._length++; return;}
    this.tail.next = node;
    this.tail = node;
    this._length++;
  }
  
  get length(){return this._length;}
  
  print(){
    let current = this.root;
    while (current){
      logger`${current.value}`;
      current = current.next;
    }
  }
  
  insertAt(value: T, pos: number) {
    if (pos > -1 && pos < this.length && this.root) {
      let current = this.root;
      let index = 0;
      let previous = current;
      let node = new ListNode(value);

      if (pos === 0) {
        node.next = this.root;
        this.root = node;
      } else {
        while (index++ < pos && current.next) {
          previous = current;
          current = current.next;
        }
        node.next = current;
        previous.next = node;
      }
      this._length++;
      return true;
    } else {
      return false;
    }
  }

  removeAt(pos: number) {
    if (pos > -1 && pos < this.length && this.root) {
      let current = this.root;
      let previous: ListNode<T> = current;
      let index = 0;

      if (pos === 0) {
        this.root = current.next;
      } else {
        while (index++ < pos && current.next) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
      }
      this._length--;
      return current;
    } else {
      return null;
    }
  }
}

const numberList = new LinkedList<number>();
numberList.add(1);
numberList.add(2);
numberList.add(3);
numberList.add(4);
logger`Number list length: ${numberList.length}`;
numberList.print();
const nameList = new LinkedList<string>();