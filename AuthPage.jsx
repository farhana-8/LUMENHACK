import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Phone, Shield, Eye, EyeOff, Building2, CheckCircle, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";


function AuthPage() {
  const [role, setRole] = useState("user");   // "user" or "admin"
  const [mode, setMode] = useState("login");  // "login" or "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { email: formData.email, password: formData.password };

    if (role === "admin" && mode === "signup") {
      payload = {
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        department: formData.department
      };
    } else if (role === "user" && mode === "signup") {
      payload = {
        username: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      };
    }

    console.log("Final Payload:", payload);

    const url =
      mode === "login"
        ? `/api/${role}/login`
        : `/api/${role}/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (res.ok) {
        alert(`${mode === "login" ? "Login" : "Signup"} successful!`);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server");
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand/Info Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
          <div className="absolute top-60 right-40 w-16 h-16 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-md text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Subscription Management System</h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Manage subscriptions, view and enjoy the app.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
              <span className="text-blue-50">Control Subscriptions</span>
            </div>
            <div className="flex items-center text-left">
              <Users className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
              <span className="text-blue-50">Multi-role access control</span>
            </div>
            <div className="flex items-center text-left">
              <Zap className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
              <span className="text-blue-50">Easy to Access</span>
            </div>
          </div>

          <div className="mt-12 text-blue-200 text-sm">
            Having issues? Please{" "}
                <Link to="/contact" className="underline hover:text-blue-400">
                Contact Us
                </Link>
                !
        </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="w-px bg-gray-200"></div>

      {/* Right Side - Form Section */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center items-center p-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-20 h-20 border border-blue-200 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 border border-blue-200 rounded-lg rotate-12"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 border border-blue-200 rounded-full"></div>
        </div>
        
        <div className="w-full max-w-lg relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6 shadow-xl">
              {role === "admin" ? (
                <Shield className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              {mode === "login" ? "Welcome Back" : "Get Started"}
            </h2>
            <p className="text-gray-600 text-lg">
              {mode === "login" ? "Sign in to your account" : "Create your new account"} as{" "}
              <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                {role === "user" ? "User" : "Administrator"}
              </span>
            </p>
          </div>

          {/* Role and Mode Toggles */}
          <div className="flex justify-between items-center mb-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            {/* Role Switch */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Account Type</span>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2 border border-gray-100">
                <button
                  onClick={() => setRole("user")}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    role === "user" 
                      ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  User
                </button>
                <button
                  onClick={() => setRole("admin")}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    role === "admin" 
                      ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Admin
                </button>
              </div>
            </div>

            {/* Mode Switch */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Action</span>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2 border border-gray-100">
                <button
                  onClick={() => setMode("login")}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === "login" 
                      ? "bg-green-600 text-white shadow-lg transform scale-105" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === "signup" 
                      ? "bg-green-600 text-white shadow-lg transform scale-105" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Premium Form Container */}
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] p-10 border border-white/60 hover:shadow-[0_48px_80px_-12px_rgba(0,0,0,0.35)] transition-all duration-700 transform hover:scale-[1.01]">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-[2rem] blur-xl"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Extra fields for User Signup */}
              {role === "user" && mode === "signup" && (
                <>
                  <div className="relative group">
                    <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                      <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-600 transition-all duration-300 z-10" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="relative w-full bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-3 border-gray-200/70 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                      <Phone className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-green-600 transition-all duration-300 z-10" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="relative w-full bg-gradient-to-r from-gray-50/80 to-green-50/50 border-3 border-gray-200/70 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:border-green-500 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </>
              )}

              {/* Extra fields for Admin Signup */}
              {role === "admin" && mode === "signup" && (
                <>
                  <div className="relative group">
                    <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                      Administrator Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                      <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-purple-600 transition-all duration-300 z-10" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter administrator name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="relative w-full bg-gradient-to-r from-gray-50/80 to-purple-50/50 border-3 border-gray-200/70 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:border-purple-500 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                      <Building2 className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-orange-600 transition-all duration-300 z-10" />
                      <input
                        type="text"
                        name="department"
                        placeholder="Enter department name"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="relative w-full bg-gradient-to-r from-gray-50/80 to-orange-50/50 border-3 border-gray-200/70 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:border-orange-500 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                  <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-cyan-600 transition-all duration-300 z-10" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="relative w-full bg-gradient-to-r from-gray-50/80 to-cyan-50/50 border-3 border-gray-200/70 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:border-cyan-500 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                  <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-red-600 transition-all duration-300 z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="relative w-full bg-gradient-to-r from-gray-50/80 to-red-50/50 border-3 border-gray-200/70 text-gray-900 pl-16 pr-16 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:border-red-500 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-all duration-300 p-2 rounded-full hover:bg-red-50 z-10"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
              </div>

              
              {/* Ultra Premium Submit Button */}
              <div className="relative mt-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-75 hover:opacity-100 transition-opacity duration-300"></div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold py-6 px-8 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
                >
                  <span className="relative z-10 text-xl">
                    {mode === "login" ? "Sign In to Portal" : "Create New Account"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              </div>

              {/* Additional Options */}
              {mode === "login" && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors" />
                    <span className="ml-3 text-sm text-gray-600 font-medium">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-10 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40">
              <p className="text-gray-700 text-base font-medium">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-blue-600 hover:text-blue-800 font-bold transition-colors hover:underline decoration-2 underline-offset-4 relative inline-flex items-center group"
                >
                  <span className="mr-2">{mode === "login" ? "Create one here" : "Sign in instead"}</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {mode === "login" ? "✨" : "🚀"}
                  </span>
                </button>
              </p>
              
              {mode === "signup" && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <button className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">Terms of Service</button>{" "}
                    and{" "}
                    <button className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">Privacy Policy</button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center justify-center mt-10 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 shadow-2xl border-2 border-white/60 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 group">
              <div className="flex items-center">
                <div className="relative">
                  <Shield className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 text-center">
                  <div className="font-black text-slate-700 text-lg bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    TEAM 57
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    🔒 Secure • 🛡️ Reliable • 🌐 Easy to Use
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
