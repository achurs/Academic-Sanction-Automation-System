import { useAuth } from "./AuthContext";
import { db } from '../config/firebase.jsx';
import { useState, useEffect } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Compose from "./Compose.jsx";
import DashboardView from "./DashboardView.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Pdf from "./Pdf.jsx";
import "../style/Home.css";

function Home() {
    const {currentUser,logout} = useAuth();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    const [department, setDepartment] = useState('');

    // Fetch user details from Firestore
    const fetchUserDetails = async () => {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name);
            setRole(userData.role);
            setEmail(userData.email);
            setDepartment(userData.department);
        }
    };
    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            setName(userData.name);
            setRole(userData.role);
            setEmail(userData.email);
            setDepartment(userData.department);
        }
    });
    useEffect(() => {
        setUid(currentUser.uid);
        fetchUserDetails();
        return () => unsubscribe();
    }, []);
  return (
    <div id="home">
        <NavBar passingrole={role} passinglogout={logout} passingdepartment={department} />
        <h1>Welcome to the Academic Sanction Automation System</h1>
        <h2>User Details</h2>
        <div id="user-details">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Department:</strong> {department}</p>
        </div>
        <Routes>
            <Route path="dashboard" element={<DashboardView passingrole={role} passingname={name} passingDepartment={department}/>} />
            <Route path="compose" element={<Compose passingrole={role} passingDepartment={department} />} />
            <Route path="pdf" element={<Pdf passingcurrentuser={currentUser} />} />
        </Routes>
    </div>
  );
}

export default Home;