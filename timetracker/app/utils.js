function toTimeString(time) {
  return dateToFormatString(time, 'H:i');
}

function toDateString(time) {
  return dateToFormatString(time, 'm.d');
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];

function dateToFormatString(time, format = 'Y.m.d H:i:s') {
  let $ = new Date(time);
  if (isNaN($)) return $;
  let Y = `${$.getFullYear()}`;
  let m = `${$.getMonth() + 1}`;
  let d = `${$.getDate()}`;
  let H = `${$.getHours()}`;
  let i = `${$.getMinutes()}`;
  let s = `${$.getSeconds()}`;
  let D = `${$.getDay()}`;
  return format
    .replace('Y', Y)
    .replace('m', m[1] ? m : `0${m}`)
    .replace('d', d[1] ? d : `0${d}`)
    .replace('H', H[1] ? H : `0${H}`)
    .replace('i', i[1] ? i : `0${i}`)
    .replace('s', s[1] ? s : `0${s}`)
    .replace('D', DAYS[D]);
}

function timeSpetnToString(time) {
  time = Math.floor(time / 1000);
  let m, h;
  m = ((time = Math.floor(time / 60)) % 60);
  h = (time = Math.floor(time / 60));
  if (m < 10) m = '0' + m;
  return `${h}h ${m}m`;
}

export {
  toTimeString,
  toDateString,
  timeSpetnToString,
  dateToFormatString,
};