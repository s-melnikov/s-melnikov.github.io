firebase.initializeApp({
    apiKey: 'AIzaSyAYoWsXOGnwLjlzbqR2uokozrDqXQCuuJU',
    databaseURL: 'https://timetracker-2dbde.firebaseio.com'
});
const auth = firebase.auth();
const {
    h,
    app
} = hyperapp;
const State = {
    forms: {},
    user: null
};
const Actions = {
    resetFormState: (name) => ({
        forms
    }) => (forms[name] = {}) && {
        forms
    },
    setFormState: ({
        form,
        name,
        value
    }) => {
        console.log(form, name, value)
    },
    authStateChange: user => ({
        user
    }),
    hashChange: () => ({
        route: location.hash.slice(2).split('/')
    })
};
const Views = {

    Form: (attrs, children) => (_, {
        resetFormState
    }) => h('form', {
        class: attrs.class,
        oncreate: () => resetFormState(attrs.name),
        onsubmit: event => {
            event.preventDefault();
            attrs.onsubmit && attrs.onsubmit();
        }
    }, children),

    Input: ({
        label,
        type,
        name,
        required
    }) => ({
        forms
    }, {
        setFormState
    }) => h('div', {
            class: 'control'
        },
        h('label', null, label),
        h('input', {
            type,
            name,
            required,
            value: forms[name],
            oninput: event => setFormState({
                name,
                value: event.target.value
            })
        })
    ),

    Router: (state, actions) => {
        let {
            route,
            user
        } = state;
        if (!user) {
            return h(Views.AuthPage);
        }
        switch (route[0]) {
            default:
                return Views.MainPage(state, actions, route);
        }
    },

    AuthPage: () => h('div', {
            class: 'auth'
        },
        h(Views.SignUp),
        h(Views.SignIn),
        h('button', {
            onclick: signInAnonymously
        }, 'Sign in anonymously')
    ),

    // SignUp: () => h('form', {class: 'sign-up', name: 'sign-up', onsubmit: data => {console.log(data)}},

    // ),

    SignUp: () => h(Views.Form, {},
        h(Views.Input, {
            label: 'Email',
            type: 'email',
            form: 'sign-up',
            name: 'email',
            required: true
        }),
        h(Views.Input, {
            label: 'Password',
            type: 'password',
            form: 'sign-up',
            name: 'pass',
            required: true
        }),
        h(Views.Input, {
            label: 'Repeat password',
            type: 'password',
            form: 'sign-up',
            name: 'repass',
            required: true
        }),
        h('button', null, 'Sign up')
    ),

    SignIn: () => h(Views.Form, {
            class: 'sign-in',
            submit: data => console.log(data)
        },
        h(Views.Input, {
            label: 'Email',
            type: 'email',
            name: 'email',
            required: true
        }),
        h(Views.Input, {
            label: 'Password',
            type: 'password',
            name: 'pass',
            required: true
        }),
        h('button', null, 'Sign in'),
    ),

    MainPage: () => h('div', {
            class: 'container'
        },
        h('div', {
                class: 'header'
            },
            h('button', {
                onclick: signOut
            }, 'Sign out')
        )
    )

};

let {
    authStateChange,
    hashChange
} = app(State, Actions, Views.Router, document.querySelector('#root'));
auth.onAuthStateChanged(authStateChange);
addEventListener('hashchange', hashChange);
hashChange();

function createUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => console.warn('signInAnonymously()', error));
}

function signInAnonymously() {
    firebase.auth().signInAnonymously().catch((error) => console.warn('signInAnonymously()', error));
}

function signOut() {
    firebase.auth().signOut().catch((error) => console.warn('signOut()', error));
}

//   ref = database.ref("dashboards/" + dashBoardId),
//   boardsRef = ref.child("boards"),
//   tasksRef = ref.child("tasks"),
//   typesRef = ref.child("types"),
//   lastBoardId = 0,
//   lastTypeId = 0,
//   lastTaskId = 0
// database = firebase.database(),
// ref = database.ref("users/" + dashBoardId);

/*
let
    DEV = location.pathname.indexOf('dev') !== -1,
    STORAGE = 'timetracker' + (DEV ? 'dev' : ''),
    LOCALE = 'ru-RU',
    WORK_DAY_LENGTH = 8,
    { app, h } = hyperapp,
    nextTaskId = 1,
    nextTimestampId = 1,
    storedData = JSON.parse(localStorage[STORAGE] || "{}"),
    getPath = () => location.hash.slice(2),
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
    daysTasks: [],
    path: getPath()
    },
    actions = {
    init: () => ($s, { getLatestTasks }) => {
        getLatestTasks();
    },
    startNewTask: () => ({ tasks, timestamps, latestTasks }, { sync }) => {
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
        let daysTasks = getLatestDaysTasks({ latestTasks, timestamps });
        return {
        tasks,
        timestamps,
        latestTasks,
        daysTasks
        };
    },
    startTask: id => ({ timestamps, latestTasks }, { sync }) => {
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
        let daysTasks = getLatestDaysTasks({ latestTasks, timestamps });
        requestIdleCallback(sync);
        return { timestamps, latestTasks, daysTasks };
    },
    getLatestTasks: () => ({ tasks, timestamps }) => {
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
        let daysTasks = getLatestDaysTasks({ latestTasks, timestamps });
        return { latestTasks, daysTasks };
    },
    update: () => ({ daysTasks }) => {
        let task = daysTasks[0] && daysTasks[0].tasks[0];
        if (task && task.current) {
        let now = Date.now();
        task.timeSpent += (now - task.lastTimestamp);
        task.lastTimestamp = now;
        }
        return { daysTasks };
    },
    makeTaskEditable: id => ({ latestTasks }) => {
        let task = latestTasks.find(task => task.id === id);
        task.editable = true;
        return { latestTasks };
    },
    editTitle: ({ id, title }) => ({ latestTasks }) => {
        let task = latestTasks.find(task => task.id === id);
        task.title = title;
        return { latestTasks };
    },
    saveTitle: id => ({ tasks, latestTasks }, { sync }) => {
        let task = latestTasks.find(task => task.id === id);
        task.editable = false;
        let _task = tasks.find(task => task.id === id);
        _task.title = task.title;
        requestIdleCallback(sync);
        return { latestTasks };
    },
    sync: () => ({ tasks, timestamps }) => {
        localStorage[STORAGE] = JSON.stringify({ tasks, timestamps });
    },
    showTaskInfo: id => ({ latestTasks }) => {
        let task = Object.assign({}, latestTasks.find(t => t.id === id));
        task.lastTimestamp = new Date(task.lastTimestamp).toUTCString();
        task.timeStart = new Date(task.timeStart).toUTCString();
        task.timeSpent = timeSpentString(task.timeSpent);
        console.log(task);
    },
    showTaskTimestamps: id => ({ timestamps }) => {
        let taskTimestamps = timestamps
        .filter(timestamp => timestamp.task === id)
        .map(timestamp => Object.assign({}, timestamp, {
            timestamp: new Date(timestamp.timestamp).toUTCString()
        }));
        console.log(taskTimestamps);
    },
    updatePath: () => ({
        path: getPath()
    })
    },
    timeSpentString = time => {
    time = Math.floor(time / 1000);
    let s, m, h, d;
    s = time % 60;
    m = ((time = Math.floor(time / 60)) % 60);
    h = ((time = Math.floor(time / 60)) % WORK_DAY_LENGTH);
    d = Math.floor(time / WORK_DAY_LENGTH);
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;
    return `${d}d ${h}h ${m}m ${s}s`;
    },
    cloneArray = array => array.slice().map(item => Object.assign({}, item)),
    intervalIdleCallback = (cb, interval) => requestIdleCallback(() => {
    let tick = () => { cb(); setTimeout(() => requestIdleCallback(tick), interval); };
    requestIdleCallback(tick);
    }),
    getLatestDaysTasks = ({ latestTasks, timestamps }) => {
    let daysTasks = [];
    latestTasks.slice().reverse().forEach(task => {
        if (task.id === 0) return;
        task = Object.assign(task);
        let date = new Date(task.lastTimestamp);
        let day = date.toLocaleDateString(LOCALE);
        let dayTasks = daysTasks.find(_dayTasks => _dayTasks.day === day);
        if (!dayTasks) {
        dayTasks = { day, tasks: [] };
        daysTasks.push(dayTasks);
        }
        dayTasks.tasks.push(task);
        dayTasks.lastTimestamp = task.lastTimestamp;
    });
    daysTasks.forEach(dayTasks => {
        let now = Date.now();
        let date = new Date(dayTasks.lastTimestamp), fromTime, toTime;
        date.setHours(0); date.setMinutes(0); date.setSeconds(0);
        fromTime = date.getTime();
        date.setHours(23); date.setMinutes(59); date.setSeconds(59);
        toTime = date.getTime();
        let dayTimestamps = timestamps.filter(({ timestamp }) => timestamp > fromTime && timestamp < toTime);
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
    },
    TasksListView = ($s, $a) => {
    let { daysTasks } = $s;
    return daysTasks ? daysTasks.map(dayTasks => h('div', { class: 'day_tasks' },
        h('div', { class: 'day_title' }, dayTasks.day),
        TasksDayView(dayTasks.tasks, $a),
        h('div', { class: 'column meta' },
        h('small', {}, `(day start: ${new Date(dayTasks.timeStart).toLocaleTimeString(LOCALE)} | day end: ${new Date(dayTasks.timeEnd).toLocaleTimeString(LOCALE)} | spent: ${timeSpentString(dayTasks.timeSpent)})`)
        )
    )) : null;
    },
    TasksDayView = (tasks, $a) => {
    return tasks ? tasks.map(({ id, title, timeStart, timeSpent, current, editable }) => {
        if (!id) return null;
        timeStart = new Date(timeStart);
        return h('div', {
            class: 'row flex ' + (current ? ' current' : '')
        },
        h('div', {
            class: 'column column_title',
            title: title,
            ondblclick: event => $a.makeTaskEditable(id)
            },
            editable ? h('input', {
            oninput: event => $a.editTitle({ id, title: event.target.value }),
            onkeyup: event => {
                if (event.key === "Enter") {
                $a.saveTitle(id);
                }
            },
            oncreate: el => el.focus(),
            value: title
            }) : title
        ),
        h('div', {
            class: 'column column_started',
            onclick: () => $a.showTaskInfo(id)
            },
            `${timeStart.toLocaleDateString(LOCALE)} ${timeStart.toLocaleTimeString(LOCALE)}`),
        h('td', {
            class: 'column column_spent',
            onclick: () => $a.showTaskTimestamps(id)
            }, timeSpentString(timeSpent)),
        h('td', { class: 'column column_actions' },
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
    },
    RootView = ($s, $a) => {
    if ($s.path === 'edit') {
        return h('div', { id: 'container' },
        h('p', { class: 'control' },
            h('a', { class: 'btn', href: '#'}, 'Main')
        ),
        h('table', {},
            h('thead', {},
            h('tr', {},
                h('th', {}, 'id'),
                h('th', {}, 'task'),
                h('th', {}, 'timestamp'),
            )
            ),
            h('tbody', {},
            $s.timestamps.map(({ id, task, timestamp }) => h('tr', {},
                h('td', {}, id),
                h('td', {}, task),
                h('td', {},
                h('input', { type: 'text', value: (new Date(timestamp)).toLocaleDateString(LOCALE) + ' ' + (new Date(timestamp)).toLocaleTimeString(LOCALE) })
                ),
            ))
            )
        )
        )
    }
    return h('div', { id: 'container' },
        h('p', { class: 'control' },
        h('button', {
            class: 'btn btn-primary',
            onclick: $a.startNewTask
        }, 'start new task'),
        h('a', { class: 'btn', href: '#/edit'}, 'Edit')
        ),
        h('div', { class: 'days_tasks' }, TasksListView($s, $a))
    )
    }
let { init, update, updatePath } = app(state, actions, RootView, document.body);
init();
update();
intervalIdleCallback(update, 1000);
if (storedData && storedData.tasks && storedData.timestamps) {
    nextTaskId = storedData.tasks[storedData.tasks.length - 1].id + 1;
    nextTimestampId = storedData.timestamps[storedData.timestamps.length - 1].id + 1;
}
addEventListener('hashchange', updatePath);

*/