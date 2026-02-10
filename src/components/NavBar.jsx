import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../style/NavBar.css";
function NavBar(props) {
  const { passingrole, passinglogout, passingdepartment } = props;
  // State to hold the count of pending requests
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!passingrole || !db) return;

    let q;
    if (passingrole === 'staffAdvisor') {
      q = query(collection(db, 'requests'), where('currentApprover', '==', 'staffAdvisor'), where('studentDepartment', '==', passingdepartment));
    } else if (passingrole === 'departmentHead') {
      q = query(collection(db, 'requests'), where('currentApprover', '==', 'departmentHead'), where('studentDepartment', '==', passingdepartment));
    } else if (passingrole === 'principal') {
      q = query(collection(db, 'requests'), where('currentApprover', '==', 'principal'));
    } else {
      return; // No need to set up a listener for students
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [passingrole, db]);

  const length = pendingCount;
  if (!passingrole) {
    return null;
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
  return (<>
    <div>
      {
        length > 0 ? (
          <div id="notification">
            <NavLink to="/dashboard">{length}</NavLink>
          </div>
        ) : null
      }
    </div>
    <nav>
      <h1>My Application</h1>
      <ul>
        <li><NavLink to="/" exact style={({isActive}) => ({
          color: isActive ? "red" : "black"
        })}>Home</NavLink></li>
        <li><NavLink to="/dashboard" style={({isActive}) => ({
          color: isActive ? "red" : "black"
        })}>Dashboard</NavLink></li>
        <li>
          <NavLink to="/pdf" style={({isActive}) => ({
            color: isActive ? "red" : "black"
          })}>Consolidated PDF</NavLink>
        </li>
        <li><button onClick={passinglogout}>Log Out</button></li>
      </ul>
    </nav>
    </>
  );
}

export default NavBar;