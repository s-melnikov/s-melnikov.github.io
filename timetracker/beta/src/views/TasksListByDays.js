import { h } from "hyperapp";
import { toTimeString } from "../utils";
import DayTasks from "./DayTasks";
import TimeSpent from "./TimeSpent";

const TaskListByDays = () => ({ daysTasks }) => (
  <div class="days_tasks">
    {daysTasks.map(({ day, timeStart, timeEnd, timeSpent, tasks }, index) => (
      <div class="day_tasks">
        <div class="day_title flex">
          <div class="col">{day}</div>
          <small class="col text-right">
            <span>{`Start: ${toTimeString(timeStart)} `}</span>
            <span>{`End: ${toTimeString(timeEnd)} `}</span>
            <span>Spent: </span>
            <TimeSpent timeSpent={timeSpent} active={!index} />
          </small>
        </div>
        <DayTasks tasks={tasks} />
      </div>
    ))}
  </div>
);

export default TaskListByDays;
