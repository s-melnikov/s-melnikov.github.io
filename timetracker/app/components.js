import {
  toTimeString,
  toDateString,
  timeSpetnToString
} from './utils.js';

const {
  h
} = hyperapp;

const RootView = ($s, $a) => {
  return h('div', {
      id: 'container'
    },
    h('p', {
        class: 'control'
      },
      h('button', {
        class: 'btn btn-primary',
        onclick: $a.startNewTask
      }, 'start new task')
    ),
    h('div', {
      class: 'days_tasks'
    }, TasksListView($s, $a))
  )
};

const TasksListView = ({
  daysTasks
}, $a) => {
  return daysTasks ? daysTasks.map(dayTasks => h('div', {
      class: 'day_tasks'
    },
    h('div', {
        class: 'day_title'
      },
      h('span', null, dayTasks.day),
      h('small', null, ' Start: ', toTimeString(dayTasks.timeStart), ' / End: ', toTimeString(dayTasks.timeEnd), ' / Spent: ', timeSpetnToString(dayTasks.timeSpent))
    ),
    h('div', {class: 'tasks_list flex'},
      TasksDayView(dayTasks.tasks, $a)
    )
  )) : null;
};

const TasksDayView = (tasks, $a) => {
  return tasks ? tasks.map(({
    id,
    title,
    timeStart,
    timeSpent,
    current,
    editable
  }) => {
    if (!id) return null;
    timeStart = new Date(timeStart);
    return h('div', {
        class: 'task' + (current ? ' current' : '')
      },
      h('div', {
          class: 'column column_title',
          title: title,
          ondblclick: event => $a.makeTaskEditable(id)
        },
        editable ? h('input', {
          oninput: event => $a.editTitle({
            id,
            title: event.target.value
          }),
          onkeyup: event => (event.key === "Enter") && $a.saveTitle(id),
          oncreate: el => el.focus(),
          value: title
        }) : title
      ),
      h('div', {
          class: 'column column_started',
          onclick: () => $a.showTaskInfo(id)
        },
        `${toDateString(timeStart)} ${toTimeString(timeStart)}`),
      h('td', {
        class: 'column column_spent',
        onclick: () => $a.showTaskTimestamps(id)
      }, h(TimeSpent, {
        timeSpent,
        active: current
      })),
      h('td', {
          class: 'column column_actions'
        },
        current ? h('button', {
          class: 'btn btn-sm btn-warning',
          onclick: event => $a.startTask(0)
        }, 'stop') : h('button', {
          class: 'btn btn-sm btn-primary',
          onclick: event => $a.startTask(id)
        }, 'start'),
        false && h('button', {
          class: 'btn btn-sm btn-success',
          onclick: () => {}
        }, 'merge')
      )
    );
  }) : null;
};

const TimeSpent = ({
  timeSpent,
  active
}) => {
  return h('span', {
    oncreate: (element) => {
      if (active) TimeSpent.timer(element, timeSpent);
    },
    onupdate: (element) => {
      if (active && !element.$clearInterval) {
        TimeSpent.timer(element, timeSpent);
      } else if (!active && element.$clearInterval) {
        element.$clearInterval();
      }
    },
    onremove: () => {
      if (element.$clearInterval) {
        element.$clearInterval();
      }
    },
  }, timeSpetnToString(timeSpent));
}

TimeSpent.timer = (element, time) => {
  let last = Date.now(),
    $interval = setInterval(() => {
      let now = Date.now();
      time += now - last;
      last = now;
      element.textContent = timeSpetnToString(time);
    }, 1000);
  element.$clearInterval = () => clearInterval($interval);
};

export {
  RootView,
  TimeSpent,
};