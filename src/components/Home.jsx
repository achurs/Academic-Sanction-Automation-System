import { useAuth } from "./AuthContext";
function Home() {
    const { currentUser, logout } = useAuth();
  return (
    <div>
        <h1>Welcome to the Academic Sanction Automation System</h1>
        <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default Home;