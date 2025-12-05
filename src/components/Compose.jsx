import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from '../config/firebase.jsx';
import { addDoc, serverTimestamp,collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
function Compose(){
    const {currentUser} = useAuth();
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !db) return;
    setIsSubmitting(true);
    try {
        const requestsCollectionRef = collection(db, 'requests');
        const newRequest = {
            studentId: currentUser.uid,
            requestType: requestType,
            description: description.trim(),
            status: "Pending Staff Advisor",
            currentApprover: "Staff Advisor",
            submissionDate: serverTimestamp(),
            history: [{
                action: 'Submitted',
                role: 'Student',
                timestamp: new Date().toISOString(),
                comment: 'Initial submission of request.',
            }],
        };
        await addDoc(requestsCollectionRef, newRequest);
        toast.success("Request submitted successfully!");
        setRequestType('');
        setDescription('');
    } catch (error) {
        console.error("Error submitting request:", error);
        toast.error("Failed to submit request. Please try again.");
    } finally {
        setIsSubmitting(false);
    }};
    return (
        <div>
        <h2>Compose a New Request</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Request Type:
                <input
                    type="text"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    placeholder="Enter the type of request"
                />
            </label>
            <br />
            <label>
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details for your request..."
                    rows={4}
                    cols={50}
                />
            </label>
            <br />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
        </form>
        <ToastContainer />
        </div>
    );
}
export default Compose;