import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Outlet } from "react-router-dom";
import { db } from '../config/firebase.jsx';
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

function DashboardView(props) {
    const { currentUser } = useAuth();
    const userRole = props.passingrole || null; // Ensure it's a string or null
    const userName = props.passingname || 'User'; // Ensure it's a string
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getNextApproverState = (currentRole) => {
    switch (currentRole) {
        case 'staffAdvisor':
            return { nextApprover: 'departmentHead', status: 'Pending departmentHead' };
        case 'departmentHead':
            return { nextApprover: 'principal', status: 'Pending principal' };
        case 'principal':
            return { nextApprover: null, status: 'Approved' };
        default:
            return { nextApprover: null, status: 'Error: Unrecognized Role' };
    }
};  

const handleApprove = async (request) => {
    // Assuming 'db' and 'currentUser' (from useAuth) are available in scope
    if (!db || !currentUser || request.currentApprover !== userRole) return;
    
    const requestDocRef = doc(db, 'requests', request.id);
    const { nextApprover, status: nextStatus } = getNextApproverState(userRole);
    
    let updatePayload = {};

    if (nextApprover) {
        updatePayload = {
            status: nextStatus,
            currentApprover: nextApprover,
        };
    } else {
        updatePayload = {
            status: nextStatus,
            currentApprover: null,
            finalApprovalDate: serverTimestamp(),
        };
    }

    try {
        await updateDoc(requestDocRef, {
            ...updatePayload,
            history: arrayUnion({
                action: 'Approved',
                role: userRole,
                approverId: currentUser.uid,
                timestamp: new Date().toISOString(),
                comment: `Approved by ${userRole}.`,
            }),
        });
        // Use your toast notification system here
        console.log(`Request ${request.id} successfully approved and moved to ${nextApprover || 'Final Approval'}.`);

    } catch (error) {
        console.error("Error approving request:", error);
        // Use your toast notification system here
        console.log("Failed to process approval.");
    }
};  
    const handleReject = async (request) => {
    // Assuming 'db' and 'currentUser' (from useAuth) are available in scope
    if (!db || !currentUser || request.currentApprover !== userRole) return;

    const requestDocRef = doc(db, 'requests', request.id);
    const rejectionComment = prompt("Please provide a brief reason for rejection:"); // Use a custom modal/input field instead of prompt in production!

    if (!rejectionComment) {
        // User cancelled rejection
        return;
    }
    
    try {
        await updateDoc(requestDocRef, {
            // Step 1: Set terminal status
            status: `Rejected`,
            currentApprover: null, // Workflow stops
            
            // Step 2: Add action to the history array
            history: arrayUnion({
                action: 'Rejected',
                role: userRole,
                approverId: currentUser.uid,
                timestamp: new Date().toISOString(),
                comment: rejectionComment,
            }),
        });

        // Use your toast notification system here
        console.log(`Request ${request.id} successfully rejected.`);

    } catch (error) {
        console.error("Error rejecting request:", error);
        // Use your toast notification system here
        console.log("Failed to process rejection.");
    }
};
    useEffect(() => {
        if (!currentUser || !userRole || userRole === null || !db) {
            setLoading(false);
            return;
        }

        console.log("Current User UID:", currentUser.uid); // <--- Add this
        console.log("Current User Role:", userRole);      // <--- Add this

        setLoading(true);
        const requestsCollectionRef = collection(db, 'requests');

        let q = null;
        if (userRole === 'student') {
            q = query(
                requestsCollectionRef,
                where("studentId", "==", currentUser.uid),
            );
            console.log("Student query set for UID:", currentUser.uid);

        } else if (userRole === 'staffAdvisor' || userRole === 'departmentHead' || userRole === 'principal') {
            q = query(
                requestsCollectionRef,
                where("currentApprover", "==", userRole)
            );
            console.log("Approver query set for role:", userRole);
        } else if(userRole){
            q = query(requestsCollectionRef,where("nonexistentField","==","noValue"));
            console.log("No valid role found, empty query set.");
        }
        if (!q) {
            console.log("Query object is null, waiting for valid userRole.");
            setLoading(false); // Stop loading, as there's nothing to fetch yet
            return; // EXIT THE USE EFFECT
        }
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(fetchedRequests);
            setLoading(false);
            setError(null);
            console.log(`Real-time update received. ${fetchedRequests.length} requests shown.`);

        }, (err) => {
            console.error("Firestore Listener Error:", err);
            setError("Failed to load requests.");
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser, userRole, db]);

    if (loading) {
        return <div>Loading Dashboard...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div>
            <h2>
                {userRole === 'student' 
                    ? `My Submissions (${userName || 'Loading...'})` 
                    : `${userRole} Approval Queue`}
            </h2>
            {requests.length === 0 ? (
                <p>
                    {userRole === 'student' ? 'You have no active submissions.' : 'Your approval queue is currently empty.'}
                </p>
            ) : (
                <div>
                    {requests.map(request => (
                        <div key={request.id}>
                            <h3>{request.requestType}</h3>
                            <p>Status: <span>{request.status}</span></p>
                            <p>Submitted by: {request.studentId.substring(0, 8)}</p>
                            {(userRole !== 'student' && request.currentApprover === userRole) && (
                                <div>
                                    <button onClick={() => handleApprove(request)}>
                                        Approve
                                    </button>
                                    <button onClick={(e) => {handleReject(request)}}>
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <Outlet />
        </div>
    );
}

export default DashboardView;