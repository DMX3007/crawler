class Node {
  constructor(value) {
    this.value;
    this.next = null;
  }
}

class Stack {
  constructor(value) {
    const newNode = new Node(value);
    this.top = newNode;
    this.length = 1;
  }
  push(value) {
    const newNode = new Node(value);
    if (this.length === 0) {
      this.top = newNode;
    } else {
      newNode.next = this.top;
      this.top = newNode;
    }
    this.length++;
    return this;
  }
  pop() {
    if (this.lenght === 0) {
      return null;
    }
    const temp = this.top;
    this.top = this.top.next;
    temp.next = null;
    this.length--;
    return temp;
  }
}

export { Stack };
