

export default {
  tasks: getTasks() || [{
    id: 0,
    title: '[Ignored task]',
  }],
  timestam: getTimestamps() || [{
    id: 0,
    task: 0,
    timestamp: 0,
  }],
  latestTasks: [],
  daysTasks: [],
};
