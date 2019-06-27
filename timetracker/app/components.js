import {
  toTimeString,
  toDateString,
  timeSpetnToString,
  dateToFormatString,
} from './utils.js';

const {
  h
} = hyperapp;

const DaysTasksListView = ({ tasks, timestamps }, $a) => {
  const days = getDays({ tasks, timestamps, from: 31 * 24 * 60 * 60 * 1000 });
  return days.map((day, index) =>
    h('div', { class: 'day_tasks' },
      h('div', { class: 'day_title flex' },
        h('div', { class: 'col' }, day.date),
        h('small', { class: 'col text-right' },
          h(TimeSpent, { timeSpent: day.spent, active: !index }),
          ' (', toTimeString(day.start), '-', toTimeString(day.end), ')',
        )
      ),
      h('div', {class: 'tasks_list'},
        TasksDayView(day.tasks, $a)
      )
    ));
};

const DaysTasks = ($s, $a) => {
  return h('div', { id: 'container' },
    h('div', { class: 'bar' },
      h('button', {
        class: 'btn btn-lg btn-primary',
        onclick: $a.startNewTask
      }, 'New task')
    ),
    h('div', {
      class: 'days_tasks'
    }, DaysTasksListView($s, $a))
  )
};

const TasksDayView = (tasks = [], $a) => {
  return tasks.map((task) => {
    const {
      id,
      title,
      start,
      end,
      spent,
      current,
      editable
    } = task;
    if (!id) return null;
    return h('div', { class: 'task' + (current ? ' current' : '') },
      h('div', { class: 'task-inner flex' },
        h('div', { class: 'btns' },
          current ? h('button', {
            class: 'btn btn-sm btn-warning',
            onclick: event => $a.startTask(0)
          }, 'stop') : h('button', {
            class: 'btn btn-sm btn-primary',
            onclick: event => $a.startTask(id)
          }, 'start'),
        ),
        h('div', {
            class: 'task_title',
            title: title,
            ondblclick: event => $a.makeTaskEditable(id)
          },
          editable ? h('input', {
            class: 'input',
            oninput: event => $a.editTitle({
              id,
              title: event.target.value
            }),
            onkeyup: event => (event.key === "Enter") && $a.saveTitle(id),
            oncreate: el => el.focus(),
            value: title
          }) : h('div', {class: 'inner'}, title)
        ),
        h('div', { class: 'meta' },
          h(TimeSpent, {
            timeSpent: spent,
            active: current
          }),
          ' (', toTimeString(start), '-', toTimeString(end), ')',
        )
      )
    );
  });
};

const RootView = ($s, $a) => {
  return h('div', {id: 'container'},
    h('div', {class: 'bar'},
      h('button', {
        class: 'btn btn-lg btn-primary',
        onclick: $a.startNewTask
      }, 'New task')
    ),
    h('div', {
      class: 'days_tasks'
    }, TasksListView($s, $a))
  )
};

const TasksListView = ({ daysTasks, tasks, timestamps }, $a) => {
  return daysTasks ? daysTasks.map((dayTasks, index) =>
    h('div', {class: 'day_tasks'},
      h('div', {class: 'day_title flex'},
        h('div', {class: 'col'}, dayTasks.day),
        h('small', {class: 'col text-right'},
          ' Start: ',
          toTimeString(dayTasks.timeStart),
          '; End: ',
          toTimeString(dayTasks.timeEnd),
          '; Spent: ',
          h(TimeSpent, {
            timeSpent: dayTasks.timeSpent,
            active: !index
          }))
      ),
      h('div', {class: 'tasks_list'},
        TasksDayView(dayTasks.tasks, $a)
      )
    )) : null;
};



const TimeSpent = ({timeSpent, active}) => {
  let clear = element => element.$clearInterval && element.$clearInterval();
  return h('span', {
    oncreate: (element) => {
      clear(element);
      if (active) TimeSpent.timer(element, timeSpent);
    },
    onupdate: (element) => {
      clear(element);
      if (active) {
        TimeSpent.timer(element, timeSpent);
      }
    },
    onremove: clear,
  }, timeSpetnToString(timeSpent));
}

TimeSpent.timer = (element, time) => {
  let uid = Date.now().toString(36);
  let last = Date.now(),
    $interval = setInterval(() => {
      let now = Date.now();
      time += now - last;
      last = now;
      element.textContent = timeSpetnToString(time);
    }, 1000);
  element.$clearInterval = () => clearInterval($interval);
};

function getDays({ tasks, timestamps, from }) {
  from = Date.now() - from;
  return timestamps
    .filter(({ timestamp }) => timestamp > from)
    .map((item, i, items) => {
      const next = items[i + 1];
      const spent = next ? (next.timestamp - item.timestamp) : 0;
      return {
        id: item.id,
        task: item.task,
        start: item.timestamp,
        end: next ? next.timestamp : null,
        spent,
      }
    })
    .reduce((days, item) => {
      if (!item.task) return days;
      const time = new Date(item.start);
      const date = dateToFormatString(time, 'D M d');
      let day = days.find(day => day.date === date);
      if (!day) {
        day = {
          date,
          spent: 0,
          tasks: [],
          start: item.start,
        };
        days.push(day);
      }
      const task = tasks.find(task => task.id === item.task);
      day.spent += item.spent;
      day.end = item.end;
      day.tasks.push({ ...item, title: task.title });
      return days;
    }, []);
}

export {
  RootView,
  TimeSpent,
  DaysTasks,
};
