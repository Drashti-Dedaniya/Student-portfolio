import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="site-nav">
      <ul className="nav-list">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
