import { useState } from 'react';
import { auth } from '../config/firebase.jsx';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { db } from '../config/firebase.jsx';
import { doc, setDoc } from 'firebase/firestore';
function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [redirect, setRedirect] = useState(false);

    if (redirect) {
        return <Navigate to="/signin" />;
    }
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Signed up user:', user);
            toast.success('Signed up successfully!');
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                name: name,
                email: email,
                uid: user.uid,
                role: 'student' //default role assigned to every new user
            });
            setTimeout(() => {
                setRedirect(true);
            }, 2000);
        } catch (error) {
            console.error('Error signing up:', error);
            toast.error('Failed to sign up. Please try again.');
            setRedirect(false);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input 
                    type="text"
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? Sign in at <Link to="/signin">Sign In</Link>
            </p>
            <ToastContainer />
        </div>
    );
}

export default SignUp;