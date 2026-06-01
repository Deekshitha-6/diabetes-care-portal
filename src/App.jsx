import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import Dashboard from "./components/Dashboard";
function App() {
  const [screen, setScreen] = useState("welcome");
  const [authenticatedEmail, setAuthenticatedEmail] = useState("");
  const handleStart = () => {
    setScreen("login");
  };
  const handleLoginSuccess = (email) => {
    setAuthenticatedEmail(email);
    setScreen("dashboard");
  };
  const handleRegisterSuccess = () => {
    setScreen("login");
  };
  const handleLogout = () => {
    setAuthenticatedEmail("");
    setScreen("welcome");
  };
  return <div className="font-sans min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden select-none">
      {screen === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {screen === "login" && <LoginScreen
    onLoginSuccess={handleLoginSuccess}
    onGoToRegister={() => setScreen("register")}
  />}
      {screen === "register" && <RegisterScreen
    onRegisterSuccess={handleRegisterSuccess}
    onGoToLogin={() => setScreen("login")}
  />}
      {screen === "dashboard" && <Dashboard
    userEmail={authenticatedEmail}
    onLogout={handleLogout}
  />}
    </div>;
}
export {
  App as default
};
