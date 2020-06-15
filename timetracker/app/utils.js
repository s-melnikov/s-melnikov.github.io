const DAYS = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WORK_DAY_LENGTH = 8;

const timeFormat = (time, format = 'Y.m.d H:i:s') => {
  const d = new Date(time);
  return isNaN(d) ? d : format
    .replace('Y', () => d.getFullYear())
    .replace('m', () => `${d.getMonth() + 1}`.padStart(2, 0))
    .replace('d', () => `${d.getDate()}`.padStart(2, 0))
    .replace('H', () => `${d.getHours()}`.padStart(2, 0))
    .replace('i', () => `${d.getMinutes()}`.padStart(2, 0))
    .replace('s', () => `${d.getSeconds()}`.padStart(2, 0))
    .replace('M', () => MONTHS[d.getMonth()])
    .replace('D', () => DAYS[d.getDay()]);
};

const timeSpent = (time, withDays) => {
  let t = Math.floor(time / 1000);
  const m = `${((t = Math.floor(t / 60)) % 60)}`.padStart(2, 0);
  if (!withDays) {
    const h = `${Math.floor(t / 60)}`.padStart(2, 0);
    return `${h}h ${m}m`;
  }
  const h = `${(t = Math.floor(t / 60)) % WORK_DAY_LENGTH}`.padStart(2, 0); 
  const d = `${Math.floor(t / WORK_DAY_LENGTH)}`; 
  return `${d}d ${h}h ${m}m`;
};

export {
  timeFormat,
  timeSpent,
};
