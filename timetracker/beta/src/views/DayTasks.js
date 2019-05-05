import { h } from 'hyperapp';
import TimeSpent from './TimeSpent';
import { toTimeString } from "../utils";

const DayTasks = ({ tasks }) => (state, actions) => {
  const {
    startTask,
    makeTaskEditable,
    editTitle,
    saveTitle,
    showTaskInfo,
    showTaskTimestamps,
  } = actions;
  return (
    <div class="tasks_list">
      {tasks.map(({
        id,
        title,
        timeStart,
        timeSpent,
        current,
        editable,
      }) => {
        if (!id) return null;
        timeStart = new Date(timeStart);
        return (
          <div class={`task${current ? " current" : ""}`}>
            <div class="task-inner flex">
              <div class="btns">
                {
                  current ? (
                    <button
                      class="btn btn-sm btn-warning"
                      onclick={() => startTask(0)}
                    >
                      stop
                      </button>
                  ) : (
                    <button
                      class="btn btn-sm btn-primary"
                      onclick={() => startTask(id)}
                    >
                      start
                      </button>
                  )
                }
              </div>
              <div
                class="task_title"
                title={title}
                ondblclick={() => makeTaskEditable(id)}
              >
                {
                  editable ? (
                    <input
                      class="input"
                      oninput={e => editTitle({ id, title: e.target.value })}
                      onkeyup={e => e.key === "Enter" && saveTitle(id)}
                      onblur={e => saveTitle(id)}
                      oncreate={el => el.focus()}
                      value={title}
                    />
                  ) : (
                      <div class="inner">{title}</div>
                    )
                }
              </div>
              <div class="meta">
                <span
                  class="task_started"
                  onclick={() => showTaskInfo(id)}
                >
                  {toTimeString(timeStart)}
                </span>
                <span
                  class="task_spent"
                  onclick={() => showTaskTimestamps(id)}
                >
                  <TimeSpent
                    timeSpent={timeSpent}
                    active={current}
                  />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayTasks;