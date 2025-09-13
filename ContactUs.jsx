import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Building2, User, MessageSquare, Clock, Globe } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Form is valid
      setIsSubmitted(true);
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
    setIsSubmitted(false);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Brand/Info Section */}
        <div className="flex-1 bg-gradient-to-br from-green-600 to-emerald-800 flex flex-col justify-center items-center text-white p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
            <div className="absolute top-60 right-40 w-16 h-16 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative z-10 max-w-md text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Message Sent Successfully!</h1>
              <p className="text-green-100 text-lg leading-relaxed">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-gray-200"></div>

        {/* Right Side - Success Section */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center items-center p-12">
          <div className="w-full max-w-lg text-center">
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] p-10 border border-white/60">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-[2rem] blur-xl"></div>
              <div className="relative z-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Your message has been received. Our team will respond to your inquiry shortly.
                </p>
                <button
                  onClick={resetForm}
                  className="relative w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 text-white font-bold py-6 px-8 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-300/50 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
                >
                  <span className="relative z-10 text-xl">Send Another Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Features */}
          <div className="space-y-4">
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
              <span className="text-blue-50">24/7 Customer Support</span>
            </div>
            <div className="flex items-center text-left">
              <Clock className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
              <span className="text-blue-50">Quick Response Time</span>
            </div>
            <div className="flex items-center text-left">
              <Globe className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
              <span className="text-blue-50">Global Reach</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 space-y-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-center text-blue-100">
                <Mail className="w-5 h-5 mr-3" />
                <span className="font-medium">contact@company.com</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-center text-blue-100">
                <Phone className="w-5 h-5 mr-3" />
                <span className="font-medium">+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-center text-blue-100">
                <MapPin className="w-5 h-5 mr-3" />
                <span className="font-medium">Business District, City</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-blue-200 text-sm">
            Business Hours: Mon-Fri 9AM-6PM EST
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
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Contact Us</h2>
            <p className="text-gray-600 text-lg">
              Send us a message and we'll get back to you as{" "}
              <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                soon as possible
              </span>
            </p>
          </div>

          {/* Premium Form Container */}
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] p-10 border border-white/60 hover:shadow-[0_48px_80px_-12px_rgba(0,0,0,0.35)] transition-all duration-700 transform hover:scale-[1.01]">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-[2rem] blur-xl"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Full Name Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                  Full Name
                  {errors.name && <span className="text-red-500 ml-2">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                  <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-600 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`relative w-full bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-3 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400 ${
                      errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200/70 focus:border-blue-500'
                    }`}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                  Email Address
                  {errors.email && <span className="text-red-500 ml-2">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                  <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-cyan-600 transition-all duration-300 z-10" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`relative w-full bg-gradient-to-r from-gray-50/80 to-cyan-50/50 border-3 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200/70 focus:border-cyan-500'
                    }`}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>}
              </div>

              {/* Company Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                  Company/Organization
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                  <Building2 className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-green-600 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    name="company"
                    placeholder="Enter your company name"
                    value={formData.company}
                    onChange={handleChange}
                    className="relative w-full bg-gradient-to-r from-gray-50/80 to-green-50/50 border-3 border-gray-200/70 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:border-green-500 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Subject Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                  Subject
                  {errors.subject && <span className="text-red-500 ml-2">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                  <MessageSquare className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-purple-600 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`relative w-full bg-gradient-to-r from-gray-50/80 to-purple-50/50 border-3 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400 ${
                      errors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-200/70 focus:border-purple-500'
                    }`}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
                {errors.subject && <p className="mt-2 text-sm text-red-600 font-medium">{errors.subject}</p>}
              </div>

              {/* Message Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                  Message
                  {errors.message && <span className="text-red-500 ml-2">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur group-focus-within:blur-md transition-all duration-300"></div>
                  <MessageSquare className="absolute left-5 top-6 text-gray-400 w-6 h-6 group-focus-within:text-orange-600 transition-all duration-300 z-10" />
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`relative w-full bg-gradient-to-r from-gray-50/80 to-orange-50/50 border-3 text-gray-900 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-0 focus:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm text-lg font-medium placeholder-gray-400 resize-none ${
                      errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-200/70 focus:border-orange-500'
                    }`}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
                {errors.message && <p className="mt-2 text-sm text-red-600 font-medium">{errors.message}</p>}
              </div>

              {/* Ultra Premium Submit Button */}
              <div className="relative mt-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-75 hover:opacity-100 transition-opacity duration-300"></div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold py-6 px-8 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
                >
                  <span className="relative z-10 text-xl flex items-center justify-center">
                    <Send className="w-6 h-6 mr-3" />
                    Send Message
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              </div>

              {/* Required Fields Notice */}
              <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 font-medium">* Required fields</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center justify-center mt-10 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 shadow-2xl border-2 border-white/60 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 group">
              <div className="flex items-center">
                <div className="relative">
                  <Mail className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div className="ml-4 text-center">
                  <div className="font-black text-slate-700 text-lg bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    CONTACT SUPPORT
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    🔒 Secure • 🛡️ Private • 📧 Professional
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