require(["app/first/index"], (first) => {
  console.log(first);
  let counter = 0;
  return {
    increment() {
      counter++;
    },
    decrement() {
      counter--;
    },
    getValue() {
      return counter;
    }
  }
});
