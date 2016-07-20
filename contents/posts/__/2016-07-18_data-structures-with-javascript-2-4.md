---
layout: post
title: Data Structures With JavaScript: Part 2 of 4
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt perferendis impedit mollitia obcaecati ad quasi, magnam ipsa nostrum, ipsum voluptatem neque fugit alias doloribus quo quam repudiandae maiores, iste voluptate!
![](posts/images/data-structures-2-of-4.jpg "Data Structures With JavaScript: Part 2 of 4")

Two of the most commonly used data structures in web development are stacks and queues. Many users of the Internet, including web developers, are unaware of this amazing fact. If you are one of these developers, then prepare yourself for two enlightening examples: the 'undo' operation of a text editor uses a stack to organize data; the event-loop of a web browser, which handles events (clicks, hoovers, etc.), uses a queue to process data.

Now pause for a moment and imagine how many times we, as both a user and developer, use stacks and queues. That is amazing, right? Due to their ubiquity and similarity in design, I have decided to use them to introduce you to data structures.

## A Stack

In computer science, a stack is a linear data structure. If this statement holds marginal value to you, as it originally did with me, consider this alternative: A stack organizes data into sequential order.

This sequential order is commonly described as a stack of dishes at a cafeteria. When a plate is added to a stack of dishes, the plate retains the order of when it was added; moreover, when a plate is added, it is pushed towards the bottom of a stack. Every time we add a new plate, the plate is pushed towards the bottom of the stack, but it also represents the top of the stack of plates.

This process of adding plates will retain the sequential order of when each plate was added into the stack. Removing plates from a stack will also retain the sequential order of all plates. If a plate is removed from the top of a stack, every other plate in the stack will still retain the correct order in the stack. What I am describing, possibly with too many words, is how plates are added and removed at most cafeterias!

To provide a more technical example of a stack, let us recall the 'undo' operation of a text editor. Every time text is added to a text editor, this text is pushed into a stack. The first addition to the text editor represents the bottom of the stack; the most recent change represents the top of the stack. If a user wants to undo the most recent change, the top of the stack is removed. This process can be repeated until there are no more additions to the stack, which is a blank file!

## Operations of a Stack

Since we now have a conceptual model of a stack, let us define the two operations of a stack:

* `push(data)` adds data.
* `pop()` removes the most recently added data.

## Implementation of a Stack

Now let us write the code for a stack!

##3 Properties of a Stack

For our implementation, we will create a constructor named `Stack`. Each instance of `Stack` will have two properties: `_size` and `_storage`.

```
function Stack() {
  this._size = 0;
  this._storage = {};
}
```

`this._storage` enables each instance of `Stack` to have its own container for storing data; `this._size` reflects the number of times data was pushed to the current version of a `Stack`. If a new instance of `Stack` is created and data is pushed into its storage, then `this._size` will increase to 1. If data is pushed, again, into the stack, `this._size` will increase to 2. If data is removed from the stack, then `this._size` will decrease to 1.

### Methods of a Stack

We need to define methods that can add (push) and remove (pop) data from a stack. Let's start with pushing data.

### Method 1 of 2: `push(data)`

(This method can be shared among all instances of `Stack`, so we'll add it to the prototype of `Stack`.)

We have two requirements for this method:

1. Every time we add data, we want to increment the size of our stack.
2. Every time we add data, we want to retain the order in which it was added.

```
Stack.prototype.push = function(data) {
  // increases the size of our storage
  var size = this._size++;

  // assigns size as a key of storage
  // assigns data as the value of this key
  this._storage[size] = data;
};
```

Our implementation of `push(data)` includes the following logic. Declare a variable named `size` and assign it the value of `this._size++`.  Assign `size` as a key of `this._storage`. And assign `data` as the value of a corresponding key.

If our stack invoked `push(data)` five times, then the size of our stack would be 5. The first push to the stack would assign that data a key of 1 in `this._storage`. The fifth invocation of `push(data)` would assign that data a key of 5 in `this._storage`. We've just assigned order to our data!
