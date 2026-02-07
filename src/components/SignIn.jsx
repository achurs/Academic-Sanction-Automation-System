import { useState } from "react";
import { auth } from "../config/firebase.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import { Navigate } from "react-router-dom";
function SignIn(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [redirect,setRedirect] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    if(redirect){
        return <Navigate to="/"/>
    }
    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Signed in user:", user);
            toast.success("Signed in successfully!");
            setTimeout(() => {
                setRedirect(true);
            }, 2000);
        } catch (error) {
            console.error("Error signing in:", error);
            toast.error("Failed to sign in. Please check your credentials.");
            setRedirect(false);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="showPassword">
                    <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                </label>
                <button type="submit">Sign In</button>
            </form>
            <p>
                New user? Sign up at <Link to="/signup">Sign Up</Link>
            </p>
            <ToastContainer />
        </div>
    );
}
export default SignIn;