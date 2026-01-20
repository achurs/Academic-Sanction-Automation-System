import { NavLink } from "react-router-dom";
function NavBar(props) {
  const { passingrole, passinglogout } = props;
  if (!passingrole) {
    return null; // Don't render the NavBar if no role is provided
  }
  if(passingrole==='student'){
    return (
      <nav>
        <h1>My Application</h1>
        <ul>
          <li>
            <NavLink to="/" exact style={({isActive}) => ({
            color: isActive ? "red" : "black"
          })}>
            Home
            </NavLink>
          </li>
          <li><NavLink to="/dashboard" style={({isActive}) => ({
            color: isActive ? "red" : "black"
          })}>Dashboard</NavLink></li>
          <li><NavLink to="/compose" style={({isActive}) => ({
            color: isActive ? "red" : "black"
          })}>Compose</NavLink></li>
          <li><button onClick={passinglogout}>Log Out</button></li>
        </ul>
      </nav>
    );
  }
  return (
    <nav>
      <h1>My Application</h1>
      <ul>
        <li><NavLink to="/" exact style={({isActive}) => ({
          color: isActive ? "red" : "black"
        })}>Home</NavLink></li>
        <li><NavLink to="/dashboard" style={({isActive}) => ({
          color: isActive ? "red" : "black"
        })}>About</NavLink></li>
        <li>
          <NavLink to="/pdf" style={({isActive}) => ({
            color: isActive ? "red" : "black"
          })}>Consolidated PDF</NavLink>
        </li>
        <li><button onClick={passinglogout}>Log Out</button></li>
      </ul>
    </nav>
  );
}

export default NavBar;