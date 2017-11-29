const toBinary = (n, size = 8) => {
  if (n < 0) {
    return Array.from({
        length: size
      }, (_, i) => {
        return ((n >> i) & 1) === 1 ? 1 : 0;
      })
      .reverse()
      .join('');
  }
  return n.toString(2).padStart(size, 0);
};