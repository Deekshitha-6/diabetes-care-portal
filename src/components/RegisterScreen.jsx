import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, User, Phone, Mail, Dumbbell, Ruler, ListCheck, Eye, EyeOff } from "lucide-react";
function RegisterScreen({ onRegisterSuccess, onGoToLogin }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [diabetesType, setDiabetesType] = useState("type2");
  const [errorText, setErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorText("");
    if (!name || !age || !email || !mobile || !password || !height || !weight || !diabetesType) {
      setErrorText("Please complete all fields to successfully register.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be atleast 6 characters.");
      setErrorText("Security criteria neglected: Password must be at least 6 characters.");
      return;
    }
    const normalizedMobile = mobile.replace(/[\s-]/g, "");
    const indianMobileRegex = /^(?:\+91|91)?[6789]\d{9}$/;
    if (!indianMobileRegex.test(normalizedMobile)) {
      setErrorText("Invalid mobile number. Must specify a valid 10-digit Indian telephone number starting with 6-9.");
      return;
    }
    const ageVal = Number(age);
    const heightVal = Number(height);
    const weightVal = Number(weight);
    if (ageVal <= 0 || ageVal > 120) {
      setErrorText("Please specify a realistic human age sequence.");
      return;
    }
    if (heightVal < 50 || heightVal > 250) {
      setErrorText("Please specify a realistic height range in centimeters.");
      return;
    }
    if (weightVal < 2 || weightVal > 400) {
      setErrorText("Please specify a realistic weight range in kilograms.");
      return;
    }
    const newProfile = {
      name,
      age: ageVal,
      gender,
      email,
      mobile: normalizedMobile,
      height: heightVal,
      weight: weightVal,
      diabetesType,
      password
      // stored natively for modular authorization sequence
    };
    const storedUsers = localStorage.getItem("dia_users");
    let registeredUsers = [];
    if (storedUsers) {
      try {
        registeredUsers = JSON.parse(storedUsers);
      } catch (err) {
        registeredUsers = [];
      }
    }
    if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setErrorText("An account with this email already exists.");
      return;
    }
    registeredUsers.push(newProfile);
    localStorage.setItem("dia_users", JSON.stringify(registeredUsers));
    alert("Registration Successful! Redirecting you back to the access portal.");
    onRegisterSuccess();
  };
  return <div className="min-h-screen bg-[#f8f9f4] flex items-center justify-center p-4 py-12" id="register-container">
      <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-lg bg-white border border-[#8fb394]/20 rounded-3xl p-8 shadow-sm"
    id="register-card"
  >
        <div className="mb-6">
          <button
    onClick={onGoToLogin}
    className="inline-flex items-center text-xs text-[#5c6e5e] hover:text-[#1a1f1a] mb-4 transition-colors font-sans gap-1 cursor-pointer"
  >
            <ArrowLeft className="w-3.5 h-3.5" /> Already registered? Log in
          </button>
          <h2 className="text-2xl font-display font-bold tracking-tight text-[#1a1f1a]" id="register-header">
            Create Medical Profile
          </h2>
          <p className="text-xs text-[#5c6e5e] mt-1 font-sans">
            Register your clinical indices to calibrate diagnostic modules
          </p>
        </div>

        {errorText && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-[#c0392b] rounded-xl text-xs font-sans text-center">
            {errorText}
          </div>}

        <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans" id="register-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-[#8fb394]" />
                <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Enter your name"
    className="w-full pl-9 pr-3 py-2 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e]"
  />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5">Age</label>
              <input
    type="number"
    value={age}
    onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
    placeholder="Years"
    className="w-full px-3 py-2 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e]"
  />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5">Gender</label>
              <select
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    className="w-full px-3 py-2 bg-white border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] focus:outline-none focus:border-[#2d362e]"
  >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5">Mobile (Indian)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4.5 h-4.5 text-[#8fb394]" />
                <input
    type="tel"
    value={mobile}
    onChange={(e) => setMobile(e.target.value)}
    placeholder="98450 XXXXX"
    className="w-full pl-9 pr-3 py-2 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e]"
  />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5">Email Route Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-[#8fb394]" />
              <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="your.email@gmail.com"
    className="w-full pl-9 pr-3 py-2 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e]"
  />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5">Secret Password (min 6 chars)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-2 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e]"
              />
              <button
                type="button"
                className="absolute right-3 top-2 flex items-center justify-center text-[#8fb394] hover:text-[#2d362e] focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                style={{ height: "24px", width: "24px" }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-[#8fb394]" /> Height (cm)
              </label>
              <input
    type="number"
    value={height}
    onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
    placeholder="170"
    className="w-full px-3 py-2 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e]"
  />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-[#8fb394]" /> Weight (kg)
              </label>
              <input
    type="number"
    value={weight}
    onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
    placeholder="70"
    className="w-full px-3 py-2 bg-[#f8f9f4]/60 border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] placeholder-gray-300 focus:outline-none focus:border-[#2d362e]"
  />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5c6e5e] mb-1.5 flex items-center gap-1">
              <ListCheck className="w-3.5 h-3.5 text-[#8fb394]" /> Diagnosed Diabetes Class
            </label>
            <select
    value={diabetesType}
    onChange={(e) => setDiabetesType(e.target.value)}
    className="w-full px-3 py-2 bg-white border border-[#8fb394]/25 rounded-xl text-sm text-[#2d362e] focus:outline-none focus:border-[#2d362e]"
  >
              <option value="prediabetes">Prediabetes</option>
              <option value="type1">Type 1 Diabetes (T1D)</option>
              <option value="type2">Type 2 Diabetes (T2D)</option>
              <option value="gestational">Gestational Diabetes</option>
              <option value="LADA">LADA (Latent Autoimmune Diabetes in Adults)</option>
            </select>
          </div>

          <button
    type="submit"
    className="w-full cursor-pointer py-3.5 bg-[#2d362e] hover:bg-[#3e4a3f] text-white rounded-xl font-semibold text-sm transition-colors mt-6 shadow-sm"
    id="btn-register-submit"
  >
            Create Clinical Profile
          </button>
        </form>
      </motion.div>
    </div>;
}
export {
  RegisterScreen as default
};
