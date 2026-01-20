import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import { collection,query,getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
function Pdf(props) {
    const { passingcurrentuser } = props;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [users, setUsers] = useState([]);

    const fetchUsers = async() => {
        if(!passingcurrentuser || !db ){
            setError("Database connection not ready");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try{
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => doc.data());
            setUsers(usersList);
        }
        catch (err){
            console.error("Error fetching users:", err);
            setError("Failed to fetch users. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    }

    const idtoname = (id) => {
        console.log("Fetching name for ID:", id);
        const user = users.find((user) => user.uid === id);
        if (user) {
            console.log("Found user:", user);
            return user.name;
        } else {
            console.log("User not found for ID:", id);
            return "Unknown User";
        }
    }

    const getOutcome = (status) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('approved')) return 'Approved';
        if (lowerStatus.includes('rejected')) return 'Rejected';
        return 'Pending';
    }

    const fetchRequests = async () => {
        if(!passingcurrentuser || !db ){
            setError("Database connection not ready");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try{
            const requestsCollectionRef = collection(db, 'requests');
            const q = query(requestsCollectionRef);
            const querySnapshot = await getDocs(q);
            const featchedRequests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(featchedRequests);
        }
        catch (err){
            console.error("Error fetching requests:", err);
            setError("Failed to fetch requests. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    }

    const exportTableToPDF = () => {
        const table = document.getElementById("reportTable");
        if(!table){
            console.error("Table with ID 'reportTable' not found.");
            return;
        }
        const doc = new jsPDF('p', 'pt', 'a4');
        autoTable(doc, { html: '#reportTable' });
        doc.save('consolidated_report.pdf');
    }

    useEffect(() => {
        fetchRequests();
        fetchUsers();
    }, [passingcurrentuser]);

    if (loading) {
        return <div>Loading requests...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Consolidated Request Summary</h1>
            <table id="reportTable">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Request Type</th>
                        <th>Description</th>
                        <th>Outcome</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>{idtoname(request.studentId)}</td>
                            <td>{request.requestType}</td>
                            <td>{request.description}</td>
                            <td>{getOutcome(request.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={exportTableToPDF}>Export to PDF</button>
            <Outlet />
        </div>
    );
}

export default Pdf;