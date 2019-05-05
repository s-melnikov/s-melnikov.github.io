import { h } from 'hyperapp';
import { Link } from '../router';
import { ButtonPrimary } from './buttons';

const NavBar = () => (state, { startNewTask }) => (
  <div class="bar">
    <Link to="/">By Days</Link>
    <Link to="/activity">By Activity</Link>
    <Link to="/date">By Date</Link>
    <hr />
    <ButtonPrimary onclick={startNewTask}>
      New task
    </ButtonPrimary>
  </div>
);

export default NavBar;