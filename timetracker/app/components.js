import { 
  timeFormat, 
  timeSpent,
} from "./utils.js";
const { h } = hyperapp;

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30;
const YEAR = DAY * 365;
const TIME_FORMAT = "H:i";
const DATE_FORMAT = "Y-m-d";
const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;
const DAY_END = [23, 59, 59];

const TimeSpent = ({ spent, active }) => {
  let clear = element => element.$clearInterval && element.$clearInterval();
  return h("span", {
    class: "time-spent",
    oncreate(element) {
      clear(element);
      if (active) TimeSpent.timer(element, spent);
    },
    onupdate(element) {
      clear(element);
      if (active) TimeSpent.timer(element, spent);
    },
    onremove(element) {
      clear(element);
    },
  }, timeSpent(spent));
}
TimeSpent.timer = (element, time) => {
  let last = Date.now();
  const $interval = setInterval(() => {
    let now = Date.now();
    time += now - last;
    last = now;
    element.textContent = timeSpent(time);
  }, 1000);
  element.$clearInterval = () => clearInterval($interval);
};

const Layout = (props, children) => (state, { handleNewTaskClick }) => {
  return h("div", { id: "container" },
    h("div", { class: "header" },
      h("button", {
        class: "btn",
        onclick: handleNewTaskClick
      }, "New task")
    ),
    h("div", { class: "content" }, children)
  )
};

const PointsView = ({ items }) => (state, actions) => h("div", { class: "tasks_list" }, 
  items.reverse().map((item) => {
    const { id, title, start, end, spent, active, task } = item;
    const {
      editedPointId,
      editedTitle,
      editedStart,
      editedEnd,
      clickedInput,
    } = state;
    const {
      handleStartTaskClick,
      handleValueClick,
      handleTitleChange,
      handlePressEnter,
    } = actions;
    return h("div", { class: "task" + (active ? " current" : "") },
      h("div", { class: "task-inner row" },
        h("div", { class: "btns col" },
          active ? h("button", {
            class: "btn btn-sm btn-warning",
            onclick() { handleStartTaskClick(0); }
          }, "stop") : h("button", {
            class: "btn btn-sm btn-primary",
            onclick() { handleStartTaskClick(task); }
          }, "start"),
        ),
        h("div", { class: "task_title col" },
          (editedPointId === id) ? h("input", { 
            value: editedTitle,
            oncreate(el) {
              if (clickedInput === "title") el.focus();
            },
            oninput({ target: { value } }) {
              handleTitleChange(value);
            },
            onkeyup({ key }) { if (key === "Enter") handlePressEnter(); }
          }) : h("div", { 
            class: "value", 
            onclick({ target }) { 
              handleValueClick({ id, name: "title" }); 
            } 
          }, title)
        ),
        h("div", { class: "meta col row" },
          (editedPointId === id) ? [
            h("input", { 
              value: timeFormat(start, TIME_FORMAT),
              oncreate(el) {
                if (clickedInput === "start") el.focus();
              },
            }),
            h("div", {}, " - "),
            h("input", { 
              value: timeFormat(end, TIME_FORMAT),
              oncreate(el) {
                if (clickedInput === "end") el.focus();
              },
            })
          ] : [
            h("div", { 
              class: "value",
              onclick({ target }) { 
                handleValueClick({ id, name: "start" });
              } 
            }, timeFormat(start, TIME_FORMAT)),
            h("div", {}, " - "),
            h("div", {
              class: "value", 
              onclick({ target }) { 
                handleValueClick({ id, name: "end" }); 
              } 
            }, timeFormat(end, TIME_FORMAT))
          ],
          h(TimeSpent, { spent, active })          
        )
      )
    );
  })
);

const TasksByDays = () => ({ tasks, points }) => {
  const minTime = Date.now() - MONTH;
  const items = points
    .filter(({ time }) => time > minTime)
    .map((point, index) => {
      const next = points[index + 1];
      let end = next ? next.time : Date.now();
      if (timeFormat(end, DATE_FORMAT) > timeFormat(point.time, DATE_FORMAT)) {
        const d = new Date(point.time);
        end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ...DAY_END);
      }
      const spent = end - point.time; 
      return { ...point, start: point.time, spent, end, active: !next };
    })
    .reduce((days, point) => {
      if (!point.task) return days;
      const dayTitle = timeFormat(point.time, "D, d M");
      const { title } = tasks.find(({ id }) => id === point.task);
      const day = days.find(({ title }) => title === dayTitle);
      if (day) {
        day.items.push({ ...point, title });
        day.end = point.end;
        day.spent = day.spent + point.spent;
      } else {
        days.push({
          start: point.time,
          end: point.end, 
          title: dayTitle,
          spent: point.spent,
          items: [{ ...point, title }]
        });
      }
      return days;
    }, []);
  return h(Layout, {}, items.reverse().map(({ title, start, end, spent, items }) => h("div", { class: "tasks" }, 
    h("div", { class: "day_title row" },
      h("div", { class: "col-1" }, title),
      h("div", { class: "col-1 text-right" },
        `${timeFormat(start, TIME_FORMAT)} - ${timeFormat(end, TIME_FORMAT)} `,
        h(TimeSpent, { spent, active: items.some(({ active }) => active) })        
      )      
    ),
    h(PointsView, { items })
  )));  
};

export {
  TasksByDays
};

// items.map(([date, items], index) => h("div", { class: "tasks" },
//   h("div", { class: "day_title row" }, date),
//   h("div", { class: "day_title row" },
//     h("div", { class: "col" }, day.date),
//     h("small", { class: "col text-right" },
//       h(TimeSpent, { timeSpent: day.spent, active: !index }),
//       " (", toTimeString(day.start), "-", toTimeString(day.end), ")",
//     )
//   ),
//   h("div", {class: "tasks_list"},
//     TasksDayView(day.tasks, $a)
//   )
// )
  
// const TasksListView = ({ daysTasks, tasks, timestamps }, $a) => {
//   return daysTasks ? daysTasks.map((dayTasks, index) =>
//     h("div", {class: "day_tasks"},
//       h("div", {class: "day_title flex"},
//         h("div", {class: "col"}, dayTasks.day),
//         h("small", {class: "col text-right"},
//           " Start: ",
//           toTimeString(dayTasks.timeStart),
//           "; End: ",
//           toTimeString(dayTasks.timeEnd),
//           "; Spent: ",
//           h(TimeSpent, {
//             timeSpent: dayTasks.timeSpent,
//             active: !index
//           }))
//       ),
//       h("div", {class: "tasks_list"},
//         TasksDayView(dayTasks.tasks, $a)
//       )
//     )) : null;
// };


// function getDays({ tasks, timestamps, from }) {
//   from = Date.now() - from;
//   return timestamps
//     .filter(({ timestamp }) => timestamp > from)
//     .map((item, i, items) => {
//       const next = items[i + 1];
//       const spent = next ? (next.timestamp - item.timestamp) : 0;
//       return {
//         id: item.id,
//         task: item.task,
//         start: item.timestamp,
//         end: next ? next.timestamp : null,
//         spent,
//       }
//     })
//     .reduce((days, item) => {
//       if (!item.task) return days;
//       const time = new Date(item.start);
//       const date = dateToFormatString(time, "D M d");
//       let day = days.find(day => day.date === date);
//       if (!day) {
//         day = {
//           date,
//           spent: 0,
//           tasks: [],
//           start: item.start,
//         };
//         days.push(day);
//       }
//       const task = tasks.find(task => task.id === item.task);
//       day.spent += item.spent;
//       day.end = item.end;
//       day.tasks.push({ ...item, title: task.title });
//       return days;
//     }, []);
// }
