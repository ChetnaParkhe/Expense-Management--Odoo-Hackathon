import React, { useState, useEffect } from 'react';
import { Building2, Mail, Lock, LogIn, User, Globe, ArrowRight, LoaderCircle, CheckCircle2, Sun, Moon, UserPlus, Search, Edit2, Trash2, Users, Shield, Briefcase } from 'lucide-react';

// --- STYLES & ANIMATIONS (Shared) ---
const DynamicBackgroundStyle = () => (
  <style>{`
    @keyframes move-bg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animated-gradient {
      background: radial-gradient(circle at 10% 20%, rgba(138, 43, 226, 0.2), transparent 40%),
                  radial-gradient(circle at 80% 90%, rgba(75, 0, 130, 0.25), transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(123, 104, 238, 0.15), transparent 45%);
      background-size: 300% 300%;
      animation: move-bg 20s ease-in-out infinite;
    }
    @keyframes move-light-bg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .light-animated-gradient {
      background: linear-gradient(135deg, #f5f3ff 0%, #eef2ff 50%, #fdf2f8 100%);
      background-size: 400% 400%;
      animation: move-light-bg 25s ease-in-out infinite;
    }
    @keyframes flow-y {
      from { background-position: 0 0; }
      to { background-position: 0 200%; }
    }
    .boundary-flow::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background: linear-gradient(to bottom, transparent 0%, #a855f7 50%, transparent 100%);
      background-size: 100% 200%;
      animation: flow-y 6s linear infinite;
      box-shadow: 0 0 10px #a855f7;
    }
  `}</style>
);

// --- REUSABLE UI COMPONENTS ---

const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className={`fixed top-4 right-4 z-[60] p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-white text-indigo-600 hover:bg-slate-200'} shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-slate-900 focus:ring-violet-500' : 'focus:ring-offset-slate-100 focus:ring-indigo-500'}`}
    aria-label="Toggle theme"
  >
    {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
  </button>
);

const InputField = ({ theme, icon: Icon, type = 'text', name, value, onChange, error, placeholder }) => {
  const themeClasses = {
    label: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    icon: theme === 'dark' ? 'text-slate-500' : 'text-slate-400',
    inputBg: theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50',
    inputText: theme === 'dark' ? 'text-white' : 'text-slate-900',
    placeholderText: theme === 'dark' ? 'placeholder-slate-500' : 'placeholder-slate-400',
    border: theme === 'dark' ? 'border-slate-600' : 'border-slate-300',
    errorBorder: theme === 'dark' ? 'border-red-500/50' : 'border-red-400',
  };
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${themeClasses.label}`}>{placeholder}</label>
      <div className="relative">
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${themeClasses.icon}`} />
        <input
          type={type} name={name} value={value} onChange={onChange}
          className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-300 ${themeClasses.inputBg} ${themeClasses.inputText} ${themeClasses.placeholderText} ${error ? themeClasses.errorBorder : themeClasses.border}`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const BrandingPanel = ({ theme, isSignUp }) => {
  const isDark = theme === 'dark';
  const title = isSignUp ? "Future of Expense Management" : "Welcome Back";
  const subtitle = isSignUp ? "Automate, analyze, and control your company spending." : "Sign in to access your dashboard and manage expenses.";

  return (
    <div className={`relative hidden lg:flex flex-col items-center justify-center p-12 text-center transition-colors duration-500 overflow-hidden ${isDark ? 'bg-slate-900/50 boundary-flow' : 'bg-white/30 backdrop-blur-lg'}`}>
      <div className={`absolute -top-1/4 -left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob ${isDark ? 'bg-purple-600' : 'bg-violet-200'}`}></div>
      <div className={`absolute -bottom-1/4 -right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000 ${isDark ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
      <div className="relative z-10">
        <h2 className={`text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {title}
        </h2>
        <p className={`mt-4 text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};


// --- SIGN-IN FORM COMPONENT ---

const SignInForm = ({ theme, onToggleView, themeClasses, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      console.log('Login data:', { email: formData.email, rememberMe });
      setLoading(false);
      onLoginSuccess(); // Trigger dashboard view
    }, 1500);
  };

  return (
    <div className={`relative border rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-500 ${themeClasses.cardBg} ${themeClasses.cardBorder} ${theme === 'dark' ? 'shadow-purple-900/40' : 'shadow-indigo-200/50'}`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-full mb-4 shadow-lg shadow-purple-600/30">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-3xl font-extrabold tracking-tight ${themeClasses.headerText}`}>Welcome Back</h1>
        <p className={`mt-2 ${themeClasses.subText}`}>Sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField theme={theme} icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="Email Address" />
        <InputField theme={theme} icon={Lock} type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="Password" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="remember-me" className={`ml-2 block text-sm ${themeClasses.subText}`}>Remember me</label>
          </div>
          <div className="text-sm">
            <a href="#" className={`font-semibold ${themeClasses.linkText}`}>Forgot password?</a>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full group bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-600/30">
          {loading ? <><LoaderCircle className="animate-spin w-5 h-5 mr-3" />Signing In...</> : <>Sign In<ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" /></>}
        </button>
        <p className={`text-center text-sm ${themeClasses.subText}`}>
          Don't have an account?{' '}
          <button type="button" onClick={onToggleView} className={`font-semibold ${themeClasses.linkText}`}>Sign Up</button>
        </p>
      </form>
    </div>
  );
};


// --- SIGN-UP FORM COMPONENT ---

const SignUpForm = ({ theme, onToggleView, themeClasses }) => {
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', companyName: '', country: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
      .then(res => res.json())
      .then(data => {
        const countryList = data.filter(c => c.currencies).map(c => ({ name: c.name.common, currency: Object.keys(c.currencies)[0] })).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      }).catch(console.error).finally(() => setCountriesLoading(false));
  }, []);

  useEffect(() => {
    if (!formData.country) { setExchangeRate(''); return; }
    const currencyCode = countries.find(c => c.name === formData.country)?.currency;
    if (currencyCode) {
      setRateLoading(true); setExchangeRate('');
      if (currencyCode === 'USD') {
        setExchangeRate('Base currency is USD.'); setRateLoading(false); return;
      }
      fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
        .then(res => res.json())
        .then(data => {
          const rate = data.rates?.[currencyCode];
          setExchangeRate(rate ? `1 USD ≈ ${rate.toFixed(2)} ${currencyCode}` : 'Live rate not available.');
        }).catch(() => setExchangeRate('Could not fetch live rate.')).finally(() => setRateLoading(false));
    }
  }, [formData.country, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.password) newErrors.password = 'Required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    if (!formData.companyName) newErrors.companyName = 'Required';
    if (!formData.country) newErrors.country = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const companyBaseCurrency = countries.find(c => c.name === formData.country)?.currency || 'USD';
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(`Account for ${formData.companyName} created! Base currency: ${companyBaseCurrency}.`);
    }, 1500);
  };

  const selectedCurrency = countries.find(c => c.name === formData.country)?.currency;

  return (
    <div className={`relative border rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-500 ${themeClasses.cardBg} ${themeClasses.cardBorder} ${theme === 'dark' ? 'shadow-purple-900/40' : 'shadow-indigo-200/50'}`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-full mb-4 shadow-lg shadow-purple-600/30">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-3xl font-extrabold tracking-tight ${themeClasses.headerText}`}>Get Started</h1>
        <p className={`mt-2 ${themeClasses.subText}`}>Create an admin account.</p>
      </div>
      {successMessage && (
        <div className={`border p-4 rounded-lg mb-6 flex items-center shadow-sm ${themeClasses.successBg}`}>
          <CheckCircle2 className={`w-6 h-6 mr-3 ${themeClasses.successText}`} />
          <span className={`font-semibold ${themeClasses.successText}`}>{successMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className={`space-y-4 border-t pt-4 ${themeClasses.fieldsetBorder}`}>
          <legend className={`text-lg font-bold mb-2 ${themeClasses.legendText}`}>Your Information</legend>
          <div className="grid grid-cols-2 gap-4">
            <InputField theme={theme} icon={User} name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="First Name" />
            <InputField theme={theme} icon={User} name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Last Name" />
          </div>
          <InputField theme={theme} icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="Email Address" />
          <div className="grid grid-cols-2 gap-4">
            <InputField theme={theme} icon={Lock} type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="Password" />
            <InputField theme={theme} icon={Lock} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="Confirm Password" />
          </div>
        </fieldset>
        <fieldset className={`space-y-4 border-t pt-4 ${themeClasses.fieldsetBorder}`}>
          <legend className={`text-lg font-bold mb-2 ${themeClasses.legendText}`}>Company Details</legend>
          <InputField theme={theme} icon={Building2} name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} placeholder="Company Name" />
          <div>
            <label className={`block text-xs font-medium mb-1 ${themeClasses.subText}`}>Country</label>
            <div className="relative">
              <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
              <select name="country" value={formData.country} onChange={handleChange} disabled={countriesLoading} className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/50 text-white placeholder-slate-500 border-slate-600' : 'bg-slate-50 text-slate-900 border-slate-300'}`}>
                <option value="">{countriesLoading ? 'Loading countries...' : 'Select a country'}</option>
                {countries.map((c) => (<option key={c.name} value={c.name}>{c.name}</option>))}
              </select>
            </div>
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            {selectedCurrency && (
              <div className={`border p-3 rounded-lg mt-2 text-sm space-y-1 ${themeClasses.infoBoxBg}`}>
                <p className={themeClasses.infoBoxText}>Base Currency: <span className={`font-bold ${themeClasses.infoBoxTextBold}`}>{selectedCurrency}</span></p>
                <div className="h-5">
                  {rateLoading && <p className={`animate-pulse ${themeClasses.infoBoxText}`}>Fetching rate...</p>}
                  {!rateLoading && exchangeRate && <p className={themeClasses.infoBoxText}>{exchangeRate}</p>}
                </div>
              </div>
            )}
          </div>
        </fieldset>
        <button type="submit" disabled={loading} className="w-full group bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-600/30">
          {loading ? <><LoaderCircle className="animate-spin w-5 h-5 mr-3" />Creating...</> : <>Create Account<ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" /></>}
        </button>
        <p className={`text-center text-sm ${themeClasses.subText}`}>
          Already have an account?{' '}
          <button type="button" onClick={onToggleView} className={`font-semibold ${themeClasses.linkText}`}>Sign In</button>
        </p>
      </form>
    </div>
  );
};

// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ theme, themeClasses }) => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'ADMIN', manager: null, status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@company.com', role: 'MANAGER', manager: null, status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'EMPLOYEE', manager: 'Sarah Smith', status: 'Active' },
    { id: 4, name: 'Emma Wilson', email: 'emma@company.com', role: 'EMPLOYEE', manager: 'Sarah Smith', status: 'Active' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: 'EMPLOYEE', manager: '' });

  const managers = users.filter(u => u.role === 'MANAGER' || u.role === 'ADMIN');
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', role: 'EMPLOYEE', manager: '' });
  };
  
  const openAddModal = () => {
    resetForm();
    setEditingUser(null);
    setShowModal(true);
  }

  const openEditModal = (user) => {
    const [firstName, ...lastNameParts] = user.name.split(' ');
    setFormData({
      firstName,
      lastName: lastNameParts.join(' '),
      email: user.email,
      role: user.role,
      manager: user.manager || ''
    });
    setEditingUser(user);
    setShowModal(true);
  };
  
  const closeModal = () => {
      setShowModal(false);
      setEditingUser(null);
      resetForm();
  }

  const handleFormSubmit = () => {
    if (editingUser) { // Update user
        setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        manager: formData.manager || null
      } : u));
    } else { // Add new user
        const newUser = {
        id: users.length + 1,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        manager: formData.manager || null,
        status: 'Active'
      };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700',
      MANAGER: theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700',
      EMPLOYEE: theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
    };
    const icons = { ADMIN: Shield, MANAGER: Briefcase, EMPLOYEE: Users };
    const Icon = icons[role];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        <Icon className="w-3 h-3" />
        {role}
      </span>
    );
  };

  return (
    <div className="w-full h-full p-6 lg:p-10 text-white">
      <div className="mb-8">
        <h1 className={`text-4xl font-extrabold tracking-tight ${themeClasses.headerText}`}>User Management</h1>
        <p className={`mt-2 ${themeClasses.subText}`}>Manage employees, managers, and their relationships.</p>
      </div>

      <div className={`rounded-xl p-4 mb-6 transition-all duration-500 ${themeClasses.cardBg} ${themeClasses.cardBorder} ${theme === 'dark' ? 'shadow-purple-900/20' : 'shadow-indigo-200/50'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/50 text-white placeholder-slate-500 border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-300'}`}
            />
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/30">
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      <div className={`rounded-xl overflow-hidden transition-all duration-500 ${themeClasses.cardBg} ${themeClasses.cardBorder} ${theme === 'dark' ? 'shadow-purple-900/20' : 'shadow-indigo-200/50'}`}>
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50'}>
            <tr>
              <th className={`text-left p-4 text-xs font-semibold uppercase tracking-wider ${themeClasses.subText}`}>User</th>
              <th className={`text-left p-4 text-xs font-semibold uppercase tracking-wider ${themeClasses.subText}`}>Role</th>
              <th className={`text-left p-4 text-xs font-semibold uppercase tracking-wider ${themeClasses.subText}`}>Manager</th>
              <th className={`text-left p-4 text-xs font-semibold uppercase tracking-wider ${themeClasses.subText}`}>Status</th>
              <th className={`text-right p-4 text-xs font-semibold uppercase tracking-wider ${themeClasses.subText}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'divide-y divide-slate-800' : 'divide-y divide-slate-200'}>
            {filteredUsers.map((user) => (
              <tr key={user.id} className={theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/50'}>
                <td className="p-4">
                  <div className={`font-medium ${themeClasses.headerText}`}>{user.name}</div>
                  <div className={`text-sm ${themeClasses.subText}`}>{user.email}</div>
                </td>
                <td className="p-4">{getRoleBadge(user.role)}</td>
                <td className={`p-4 text-sm ${themeClasses.subText}`}>{user.manager || '—'}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(user)} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-400 hover:bg-slate-700' : 'text-blue-600 hover:bg-blue-50'}`}><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteUser(user.id)} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-slate-700' : 'text-red-600 hover:bg-red-50'}`}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`relative border rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-500 ${themeClasses.cardBg} ${themeClasses.cardBorder} ${theme === 'dark' ? 'shadow-purple-900/40' : 'shadow-indigo-200/50'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${themeClasses.headerText}`}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <InputField theme={theme} icon={User} name="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="First Name" />
                 <InputField theme={theme} icon={User} name="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Last Name" />
              </div>
               <InputField theme={theme} icon={Mail} type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email Address" />
              <div>
                <label className={`block text-xs font-medium mb-1 ${themeClasses.subText}`}>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-700 text-white placeholder-slate-500 border-slate-600' : 'bg-slate-50 text-slate-900 border-slate-300'}`}>
                  <option value="EMPLOYEE">Employee</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option>
                </select>
              </div>
              {formData.role === 'EMPLOYEE' && (
                <div>
                  <label className={`block text-xs font-medium mb-1 ${themeClasses.subText}`}>Assign Manager</label>
                  <select value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-700 text-white placeholder-slate-500 border-slate-600' : 'bg-slate-50 text-slate-900 border-slate-300'}`}>
                    <option value="">Select Manager</option>
                    {managers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${theme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}>Cancel</button>
              <button onClick={handleFormSubmit} className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all">
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- MAIN APP COMPONENT (CONTROLLER) ---

export default function AuthPage() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('signIn'); // 'signIn', 'signUp', 'dashboard'

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleAuthView = () => {
    setView(prev => prev === 'signIn' ? 'signUp' : 'signIn');
  };
  
  const handleLoginSuccess = () => {
      setView('dashboard');
  }

  const themeClasses = {
    bg: theme === 'dark' ? 'bg-slate-900' : 'bg-white',
    cardBg: theme === 'dark' ? 'bg-slate-800/60 backdrop-blur-md' : 'bg-white/60 backdrop-blur-xl',
    cardBorder: theme === 'dark' ? 'border-slate-700' : 'border-white/50',
    headerText: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    subText: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    legendText: theme === 'dark' ? 'text-slate-200' : 'text-indigo-900/80',
    fieldsetBorder: theme === 'dark' ? 'border-slate-700' : 'border-slate-300/70',
    successBg: theme === 'dark' ? 'bg-green-900/50 border-green-700' : 'bg-green-100/70 border-green-500/50',
    successText: theme === 'dark' ? 'text-green-300' : 'text-green-800',
    infoBoxBg: theme === 'dark' ? 'bg-slate-700/50 border-slate-600' : 'bg-white/50 border-slate-200/80',
    infoBoxText: theme === 'dark' ? 'text-slate-300' : 'text-slate-700',
    infoBoxTextBold: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    linkText: theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500',
  };

  const AuthView = () => (
    <div className="relative z-20 min-h-screen flex">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
            {view === 'signUp' ? (
            <SignUpForm theme={theme} onToggleView={toggleAuthView} themeClasses={themeClasses} />
            ) : (
            <SignInForm theme={theme} onToggleView={toggleAuthView} themeClasses={themeClasses} onLoginSuccess={handleLoginSuccess}/>
            )}
        </div>
        <BrandingPanel theme={theme} isSignUp={view === 'signUp'} />
    </div>
  );

  return (
    <>
      <DynamicBackgroundStyle />
      <div className={`min-h-screen font-sans transition-colors duration-500 ${themeClasses.bg}`}>
        {/* Animated Backgrounds */}
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`}>
            <div className="animated-gradient w-full h-full"></div>
            <div className="absolute inset-0 z-10 bg-black/30"></div>
        </div>
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}>
            <div className="light-animated-gradient w-full h-full"></div>
        </div>
        
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

        <div className="relative z-20 min-h-screen">
            {view === 'dashboard' ? <AdminDashboard theme={theme} themeClasses={themeClasses} /> : <AuthView />}
        </div>
      </div>
    </>
  );
}