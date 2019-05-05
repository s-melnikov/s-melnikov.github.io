import { h } from "hyperapp";
import { Route, Switch, Redirect } from "../router";
import TasksListByDays from "./TasksListByDays";
import NavBar from "./NavBar";

const RootView = () => (state, { startNewTask }) => (
  <div id="container">
    <NavBar />
    <Switch>
      <Route path="/" render={TasksListByDays} />
    </Switch>
  </div>
);

export default RootView;
