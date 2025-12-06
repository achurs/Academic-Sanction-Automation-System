import { useAuth } from "./AuthContext";
import { db } from '../config/firebase.jsx';
import { useState, useEffect } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Compose from "./Compose.jsx";
import DashboardView from "./DashboardView.jsx";

function Home() {
    const {currentUser,logout} = useAuth();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    
    // Fetch user details from Firestore
    const fetchUserDetails = async () => {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name);
            setRole(userData.role);
            setEmail(userData.email);
        }
    };
    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            setName(userData.name);
            setRole(userData.role);
            setEmail(userData.email);
        }
    });
    useEffect(() => {
        setUid(currentUser.uid);
        fetchUserDetails();
        return () => unsubscribe();
    }, []);
  return (
    <div>
        <h1>Welcome to the Academic Sanction Automation System</h1>
        <h2>User Details</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>UID:</strong> {uid}</p>
        <p><strong>Role:</strong> {role}</p>
        <DashboardView passingrole={role} passingname={name}/>
        <Compose passingrole={role} />
        <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default Home;