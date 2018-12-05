import {
    dateToFormatString,
    timeSpetnToString,
  } from './utils.js';
import {
  RootView,
} from './components.js';
import Router from './router.js';
let STORAGE = 'timetracker',
  {
    app,
    h
  } = hyperapp,
  nextTaskId = 1,
  nextTimestampId = 1,
  storedData = JSON.parse(localStorage[STORAGE] || "{}"),
  state = {
    tasks: storedData.tasks || [{
      id: 0,
      title: '[Ignored task]'
    }],
    timestamps: storedData.timestamps || [{
      id: 0,
      task: 0,
      timestamp: 0
    }],
    latestTasks: [],
    daysTasks: []
  },
  actions = {
    init: () => ($s, {
      getLatestTasks
    }) => {
      getLatestTasks();
    },
    startNewTask: () => ({
      tasks,
      timestamps,
      latestTasks
    }, {
      sync
    }) => {
      let now = Date.now();
      let newTask = {
        id: nextTaskId,
        title: `New task #${nextTaskId++}`
      };
      let newTimestamp = {
        id: nextTimestampId++,
        task: newTask.id,
        timestamp: now
      };
      latestTasks.map((task, i) => {
        if (task.current) {
          task.timeSpent += (now - task.lastTimestamp);
          delete task.current;
        }
      });
      requestIdleCallback(sync);
      tasks = [...tasks, newTask];
      timestamps = [...timestamps, newTimestamp];
      latestTasks = [...latestTasks, Object.assign({
        timeStart: now,
        timeSpent: 0,
        lastTimestamp: now,
        current: true
      }, newTask)];
      let daysTasks = getLatestDaysTasks({
        latestTasks,
        timestamps
      });
      return {
        tasks,
        timestamps,
        latestTasks,
        daysTasks
      };
    },
    startTask: id => ({
      timestamps,
      latestTasks
    }, {
      sync
    }) => {
      let now = Date.now();
      let newTimestamp = {
        id: nextTimestampId++,
        task: id,
        timestamp: now
      };
      let targetTask = latestTasks.find(task => task.id === id);
      latestTasks.splice(latestTasks.indexOf(targetTask), 1);
      latestTasks.forEach(task => {
        if (task.current) {
          task.timeSpent += (now - task.lastTimestamp);
          delete task.current;
        }
        return task;
      });
      targetTask.current = true;
      targetTask.lastTimestamp = now;
      timestamps = [...timestamps, newTimestamp];
      latestTasks = [...latestTasks, targetTask];
      let daysTasks = getLatestDaysTasks({
        latestTasks,
        timestamps
      });
      requestIdleCallback(sync);
      return {
        timestamps,
        latestTasks,
        daysTasks
      };
    },
    getLatestTasks: () => ({
      tasks,
      timestamps
    }) => {
      let now = Date.now();
      let oldest = now - 14 * 24 * 60 * 60 * 1000;
      let lastTimestamps = timestamps.filter(timestamp => timestamp.timestamp > oldest || !timestamp.task);
      let latestTasks = [];
      lastTimestamps.forEach((timestamp, i) => {
        let nextTimestamp = lastTimestamps[i + 1];
        let task = latestTasks.find(_task => _task.id === timestamp.task);
        if (task) {
          latestTasks.splice(latestTasks.indexOf(task), 1);
        } else {
          task = Object.assign({
            timeStart: timestamp.timestamp,
            timeSpent: 0
          }, tasks.find(_task => _task.id === timestamp.task));
        }
        latestTasks.push(task);
        if (nextTimestamp) {
          task.timeSpent += (nextTimestamp.timestamp - timestamp.timestamp);
          task.lastTimestamp = timestamp.timestamp;
        } else {
          task.timeSpent += (now - timestamp.timestamp);
          task.lastTimestamp = now;
          task.current = true;
        }
      });
      let daysTasks = getLatestDaysTasks({
        latestTasks,
        timestamps
      });
      return {
        latestTasks,
        daysTasks
      };
    },
    makeTaskEditable: id => ({
      latestTasks
    }) => {
      let task = latestTasks.find(task => task.id === id);
      task.editable = true;
      return {
        latestTasks
      };
    },
    editTitle: ({
      id,
      title
    }) => ({
      latestTasks
    }) => {
      let task = latestTasks.find(task => task.id === id);
      task.title = title;
      return {
        latestTasks
      };
    },
    saveTitle: id => ({
      tasks,
      latestTasks
    }, {
      sync
    }) => {
      let task = latestTasks.find(task => task.id === id);
      task.editable = false;
      let _task = tasks.find(task => task.id === id);
      _task.title = task.title;
      requestIdleCallback(sync);
      return {
        latestTasks
      };
    },
    sync: () => ({
      tasks,
      timestamps
    }) => {
      localStorage[STORAGE] = JSON.stringify({
        tasks,
        timestamps
      });
    },
    showTaskInfo: id => ({
      latestTasks
    }) => {
      let task = Object.assign({}, latestTasks.find(t => t.id === id));
      task.lastTimestamp = new Date(task.lastTimestamp).toUTCString();
      task.timeStart = new Date(task.timeStart).toUTCString();
      task.timeSpent = timeSpetnToString(task.timeSpent);
      console.log(task);
    },
    showTaskTimestamps: id => ({
      timestamps
    }) => {
      let taskTimestamps = timestamps
        .filter(timestamp => timestamp.task === id)
        .map(timestamp => Object.assign({}, timestamp, {
          timestamp: new Date(timestamp.timestamp).toUTCString()
        }));
    }
  },
  cloneArray = array => array.slice().map(item => Object.assign({}, item)),
  intervalIdleCallback = (cb, interval) => requestIdleCallback(() => {
    let tick = () => {
      cb();
      setTimeout(() => requestIdleCallback(tick), interval);
    };
    requestIdleCallback(tick);
  }),
  getLatestDaysTasks = ({
    latestTasks,
    timestamps
  }) => {
    let daysTasks = [];
    latestTasks.slice().reverse().forEach(task => {
      if (task.id === 0) return;
      task = Object.assign(task);
      let date = new Date(task.lastTimestamp);
      let day = dateToFormatString(date, 'd.m D');
      let dayTasks = daysTasks.find(_dayTasks => _dayTasks.day === day);
      if (!dayTasks) {
        dayTasks = {
          day,
          tasks: []
        };
        daysTasks.push(dayTasks);
      }
      dayTasks.tasks.push(task);
      dayTasks.lastTimestamp = task.lastTimestamp;
    });
    daysTasks.forEach(dayTasks => {
      let now = Date.now();
      let date = new Date(dayTasks.lastTimestamp);
      let fromTime, toTime;
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      fromTime = date.getTime();
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
      toTime = date.getTime();
      let dayTimestamps = timestamps.filter(({
        timestamp
      }) => (timestamp > fromTime && timestamp < toTime));
      if (now > fromTime && now < toTime) {
        dayTasks.current = true;
      }
      dayTasks.timeStart = 0;
      dayTasks.timeSpent = 0;
      dayTimestamps.map((timestamp, i) => {
        let skiped = timestamp.task === 0;
        let nextTimestamp = dayTimestamps[i + 1];
        if (!skiped && dayTasks.timeStart === 0) {
          dayTasks.timeStart = timestamp.timestamp;
        }
        if (nextTimestamp) {
          if (!skiped) {
            dayTasks.timeSpent += nextTimestamp.timestamp - timestamp.timestamp;
          }
        } else {
          dayTasks.timeEnd = timestamp.timestamp;
          if (dayTasks.current && !skiped) {
            dayTasks.timeSpent += now - timestamp.timestamp
          }
        }
      });
    });
    return daysTasks;
  };
const routes = {
  '/': RootView,
}
let {init} = Router(app)(state, actions, routes, document.body);
init();
if (storedData && storedData.tasks && storedData.timestamps) {
  nextTaskId = storedData.tasks[storedData.tasks.length - 1].id + 1;
  nextTimestampId = storedData.timestamps[storedData.timestamps.length - 1].id + 1;
}