import {
  toTimeString,
  toDateString,
  timeSpetnToString
} from './utils.js';

const {
  h
} = hyperapp;

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

const TasksListView = ({
  daysTasks
}, $a) => {
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
      h('div', {class: 'task-inner flex'},
        h('div', {class: 'btns'},
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
        h('div', {class: 'meta'},
          h('span', {
              class: 'task_started',
              onclick: () => $a.showTaskInfo(id)
            }, toTimeString(timeStart)),
          h('span', {
            class: 'task_spent',
            onclick: () => $a.showTaskTimestamps(id)
          }, h(TimeSpent, {
            timeSpent,
            active: current
          })),
        )
      )
    );
  }) : null;
};

const TimeSpent = ({timeSpent, active}) => {
  let check = element => element.$clearInterval && element.$clearInterval();
  return h('span', {
    oncreate: (element) => {
      check(element);
      if (active) TimeSpent.timer(element, timeSpent);
    },
    onupdate: (element) => {
      if (active && !element.$clearInterval) {
        TimeSpent.timer(element, timeSpent);
      } else if (!active) {
        check(element);
      }
    },
    onremove: check,
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

export {
  RootView,
  TimeSpent,
};