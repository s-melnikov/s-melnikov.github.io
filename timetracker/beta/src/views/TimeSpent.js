import { h } from 'hyperapp';
import { timeSpetnToString } from '../utils';

const timer = (element, time) => {
  let last = Date.now();
  let $interval = setInterval(() => {
    let now = Date.now();
    time += now - last;
    last = now;
    element.textContent = timeSpetnToString(time);
  }, 1000);
  element.$clearInterval = () => clearInterval($interval);
};

const TimeSpent = ({ timeSpent, active }) => {
  let clear = element => element.$clearInterval && element.$clearInterval();
  return (
    <span
      oncreate={element => {
        clear(element);
        if (active) timer(element, timeSpent);
      }}
      onupdate={element => {
        clear(element);
        if (active) {
          timer(element, timeSpent);
        }
      }}
      onremove={clear}
    >
      {timeSpetnToString(timeSpent)}
    </span>
  );
};

export default TimeSpent;