import { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, Mail, User, Eye, EyeOff } from "lucide-react";
function LoginScreen({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotContact, setForgotContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpReceipt, setOtpReceipt] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handlePreload = () => {
    setUsername("Enter your name");
    setEmail("Enter your email");
    setPassword("diabetes123");
    setErrorMessage("");
  };
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!username || !email || !password) {
      setErrorMessage("Please fill in all login fields.");
      return;
    }
    const storedUsers = localStorage.getItem("dia_users");
    let registeredUsers = [];
    if (storedUsers) {
      try {
        registeredUsers = JSON.parse(storedUsers);
      } catch (err) {
        registeredUsers = [];
      }
    }
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (foundUser) {
      if (foundUser.password === password) {
        setSuccessMessage("Login Successful!");
        onLoginSuccess(foundUser.email);
      } else {
        setErrorMessage("Incorrect password.");
      }
    } else if (email.toLowerCase() === "deekshitha6@gmail.com" && password === "diabetes123") {
      const defaultProfile = {
        name: "Deekshitha",
        age: 28,
        gender: "Female",
        email: "deekshitha6@gmail.com",
        mobile: "9845012345",
        height: 165,
        weight: 68,
        diabetesType: "type2",
        password: "diabetes123"
      };
      registeredUsers.push(defaultProfile);
      localStorage.setItem("dia_users", JSON.stringify(registeredUsers));
      setSuccessMessage("Login Successful!");
      onLoginSuccess("deekshitha6@gmail.com");
    } else {
      setErrorMessage("User not found. Please click Register to sign up.");
    }
  };
  const handleForgotPassword = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!email) {
      setErrorMessage("Please enter your Email URL so we can look up your password.");
      return;
    }
    const storedUsers = localStorage.getItem("dia_users");
    let registeredUsers = [];
    if (storedUsers) {
      try {
        registeredUsers = JSON.parse(storedUsers);
      } catch (err) {
      }
    }
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (foundUser) {
      setSuccessMessage(`Account found! Your password is: "${foundUser.password}"`);
    } else if (email.toLowerCase().trim() === "deekshitha6@gmail.com") {
      setSuccessMessage('Account found! Your password is: "diabetes123"');
    } else {
      setErrorMessage(`No registered account found under the email "${email}".`);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-[#f8f9f4] px-4 py-8" id="login-container">
      <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-md bg-white border border-[#8fb394]/20 rounded-3xl p-8 shadow-sm"
    id="login-card"
  >
        <div className="mb-6 text-center">
              <h2 className="text-2xl font-display font-bold tracking-tight text-[#1a1f1a]" id="login-header">
                Access Portal
              </h2>
              <p className="text-xs text-[#5c6e5e] mt-1 font-sans">
                Enter your credentials to manage diabetes metrics
              </p>
            </div>

            {errorMessage && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-[#c0392b] rounded-xl text-xs font-sans text-center animate-pulse" id="login-error">
                {errorMessage}
              </div>}

            {successMessage && <div className="mb-4 p-3 bg-[#8fb394]/10 border border-[#8fb394]/25 text-[#2d362e] rounded-xl text-xs font-sans text-center" id="login-success">
                {successMessage}
              </div>}

            <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
              <div>
                <label className="block text-xs font-sans font-semibold text-[#5c6e5e] mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8fb394]" />
                  <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Enter your name"
    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm font-sans text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e] focus:ring-1 focus:ring-[#2d362e]"
    id="login-username-input"
  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-[#5c6e5e] mb-1.5">
                  Email URL
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8fb394]" />
                  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm font-sans text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e] focus:ring-1 focus:ring-[#2d362e]"
    id="login-email-input"
  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-sans font-semibold text-[#5c6e5e]">
                    Password
                  </label>
                  <button
    type="button"
    onClick={handleForgotPassword}
    className="text-xs text-[#e67e22] hover:text-[#d35400] font-medium transition-colors"
    id="btn-forgot-password"
  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-[#8fb394]" />
                  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full pl-10 pr-11 py-2.5 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm font-sans text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e] focus:ring-1 focus:ring-[#2d362e]"
    id="login-password-input"
  />
                  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3.5 top-3.5 text-[#8fb394] hover:text-[#2d362e] transition-colors focus:outline-none"
    id="btn-toggle-password-view"
  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
    type="submit"
    className="w-full cursor-pointer py-3 bg-[#2d362e] hover:bg-[#3e4a3f] text-white rounded-xl font-sans font-medium text-sm transition-colors mt-6 shadow-sm"
    id="btn-login-submit"
  >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#f8f9f4] text-center">
              <span className="text-xs text-[#5c6e5e] font-sans">
                Not registered yet?{" "}
              </span>
              <button
    onClick={onGoToRegister}
    className="text-xs text-[#e67e22] font-sans font-semibold hover:underline hover:text-[#d35400] cursor-pointer"
    id="btn-go-register"
  >
                Create Account
              </button>
            </div>
        </motion.div>
      </div>;
}
export {
  LoginScreen as default
};
