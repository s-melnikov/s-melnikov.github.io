var Utils = {
  equals: function (a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  },
  clone: function (a) {
    try {
      return JSON.parse(JSON.stringify(a));
    } catch (e) {
      return undefined;
    }
  }
};
