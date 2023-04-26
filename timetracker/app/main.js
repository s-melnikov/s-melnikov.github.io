import { TasksByDays } from "./components.js";
import Router from "./router.js";

const { app, h } = hyperapp;
const STORAGE = "timetracker";
const { tasks = [], points = [] } = JSON.parse(localStorage[STORAGE] || "{}");
const state = { tasks, points };
const getNextItemId = (items) => (items.reduce((max, { id }) => (id > max ? id : max), 0) + 1);

const actions = {
  addTask: () => ({ tasks, points }) => {
    const taskId = getNextItemId(tasks);
    return {
      tasks: [
        ...tasks, 
        {
          id: taskId,
          title: `Task #${taskId}`
        }
      ],
      points: [
        ...points, 
        {
          id: getNextItemId(points),
          task: taskId,
          time: Date.now()
        }
      ],
    };
  },
  startTask: (task) => ({ points }, { sync }) => ({
    points: [
      ...points, 
      {
        id: getNextItemId(points),
        task,
        time: Date.now()
      },
    ],
  }),
  updateTask: ({ id, data }) => ({ tasks }) => ({
    tasks: tasks.map((task) => (task.id === id ? { ...task, ...data } : task)),
  }),
  sync: () => ({ tasks, points }) => {
    localStorage[STORAGE] = JSON.stringify({ tasks, points });
  },
  handleNewTaskClick: () => (state, { addTask, sync }) => {
    addTask();
    sync();
  },
  handleStartTaskClick: (taskId) => (state, { startTask, sync }) => {
    startTask(taskId);
    sync();
  },
  handleTitleChange: (editedTitle) => ({ editedTitle }),
  handleValueClick: ({ id: pointId, name }) => ({ tasks, points }) => {
    const point = points.find(({ id }) => id === pointId);
    const task = tasks.find(({ id }) => id === point.task);
    const pointIndex = points.indexOf(point);
    const nextPoint = points[pointIndex + 1];    
    return {
      editedPointId: pointId,
      editedTaskId: task.id,
      editedTitle: task.title,
      editedStart: point.time,
      editedEnd: nextPoint && nextPoint.time,
      clickedInput: name
    };
  },
  handlePressEnter: () => (state, { sync, updateTask }) => {
    const {
      editedTaskId,
      editedTitle,
    } = state;
    updateTask({ 
      id: editedTaskId, 
      data: { 
        title: editedTitle
      } 
    });
    sync();
    return {
      editedPointId: null,
      editedTaskId: null,
      editedTitle: null,
      editedStart: null,
      editedEnd: null
    };
  }
};
const routes = { "/": TasksByDays };
const main = Router(app)(state, actions, routes, document.getElementById("root"));

// function getLatestTasks() {
//   return ({ tasks, points }) => {
//     let now = Date.now();
//     let oldest = now - 14 * 24 * 60 * 60 * 1000;
//     let lastpoints = points.filter(timestamp => timestamp.timestamp > oldest || !timestamp.task);
//     let latestTasks = [];
//     lastpoints.forEach((timestamp, i) => {
//       let nextTimestamp = lastpoints[i + 1];
//       let task = latestTasks.find(_task => _task.id === timestamp.task);
//       if (task) {
//         latestTasks.splice(latestTasks.indexOf(task), 1);
//       } else {
//         task = Object.assign({
//           timeStart: timestamp.timestamp,
//           timeSpent: 0
//         }, tasks.find(_task => _task.id === timestamp.task));
//       }
//       latestTasks.push(task);
//       if (nextTimestamp) {
//         task.timeSpent += (nextTimestamp.timestamp - timestamp.timestamp);
//         task.lastTimestamp = timestamp.timestamp;
//       } else {
//         task.timeSpent += (now - timestamp.timestamp);
//         task.lastTimestamp = now;
//         task.current = true;
//       }
//     });
//     let daysTasks = getLatestDaysTasks({
//       latestTasks,
//       points
//     });
//     return {
//       latestTasks,
//       daysTasks
//     };
//   };
// }

// function getLatestDaysTasks({ latestTasks, points }) {
//   let daysTasks = [];
//   latestTasks.slice().reverse().forEach(task => {
//     if (task.id === 0) return;
//     task = Object.assign(task);
//     let date = new Date(task.lastTimestamp);
//     let day = dateToFormatString(date, "d.m D");
//     let dayTasks = daysTasks.find(_dayTasks => _dayTasks.day === day);
//     if (!dayTasks) {
//       dayTasks = { day, tasks: [] };
//       daysTasks.push(dayTasks);
//     }
//     dayTasks.tasks.push(task);
//     dayTasks.lastTimestamp = task.lastTimestamp;
//   });
//   daysTasks.forEach(dayTasks => {
//     let now = Date.now();
//     let date = new Date(dayTasks.lastTimestamp);
//     let fromTime, toTime;
//     date.setHours(0);
//     date.setMinutes(0);
//     date.setSeconds(0);
//     fromTime = date.getTime();
//     date.setHours(23);
//     date.setMinutes(59);
//     date.setSeconds(59);
//     toTime = date.getTime();
//     let daypoints = points.filter(({
//       timestamp
//     }) => (timestamp > fromTime && timestamp < toTime));
//     if (now > fromTime && now < toTime) {
//       dayTasks.current = true;
//     }
//     dayTasks.timeStart = 0;
//     dayTasks.timeSpent = 0;
//     daypoints.map((timestamp, i) => {
//       let skiped = timestamp.task === 0;
//       let nextTimestamp = daypoints[i + 1];
//       if (!skiped && dayTasks.timeStart === 0) {
//         dayTasks.timeStart = timestamp.timestamp;
//       }
//       if (nextTimestamp) {
//         if (!skiped) {
//           dayTasks.timeSpent += nextTimestamp.timestamp - timestamp.timestamp;
//         }
//       } else {
//         dayTasks.timeEnd = timestamp.timestamp;
//         if (dayTasks.current && !skiped) {
//           dayTasks.timeSpent += now - timestamp.timestamp
//         }
//       }
//     });
//   });
//   return daysTasks;
// }
