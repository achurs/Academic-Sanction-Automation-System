import { useState,useEffect } from "react";
import { db } from "../config/firebase";
import { doc, getDocs,collection,updateDoc } from "firebase/firestore";
import "../style/AdminDashboard.css";
function AdminDashboard() {
    const [password, setPassword] = useState('');
    const password_value = "adminpass";
    const predefinedRoles = ["student", "staffAdvisor", "departmentHead", "principal"];
    const predefinedDepartments = ["CSE", "BT", "MECH", "CIVIL"];
    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => doc.data());
        setUsers(usersList);
    }
    const updateUserRole = async (uid, newRole) => {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, { role: newRole });
        fetchUsers(); // Refresh the user list after updating
    }
    const updateUserDepartment = async (uid, newDepartment) => {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, { department: newDepartment });
        fetchUsers(); // Refresh the user list after updating
    }
    useEffect(() => {
        fetchUsers();
    }, []);
  return (
    <div id="admin-dash">
        <h2>Admin Dashboard</h2>
        {password !== password_value ? (
            <div id="admin-login">
                <input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => {
                    if (password === password_value) {
                        alert("Access granted to admin dashboard.");
                    } else {
                        alert("Incorrect password. Access denied.");
                    }
                }}>Submit</button>
            </div>
        ) : (
            <div id="admin-dashboard">
                <h3>Welcome, Admin!</h3>
                <p>Here you can change the roles of the users</p>
                <h4>Role Management</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.uid}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select
                                        value={user.department}
                                        onChange={(e) => updateUserDepartment(user.uid, e.target.value)}
                                    >
                                        {predefinedDepartments.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user.uid, e.target.value)}
                                    >
                                        {predefinedRoles.map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
}

export default AdminDashboard;