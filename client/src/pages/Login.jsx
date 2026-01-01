import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiZap, FiEye, FiEyeOff, FiShield, FiTrendingUp, FiPackage, FiLayers } from 'react-icons/fi';
import { authService } from '../services/authService';

const Login = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      if (response.success) {
        onLogin(response.data);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'An error occurred during login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-amber-900/30 to-slate-900 px-4 relative overflow-hidden">
      {/* Textile Manufacturing Theme Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fabric Weave Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(251,191,36,.05)_50%,transparent_75%,transparent_100%),linear-gradient(-45deg,transparent_25%,rgba(251,191,36,.05)_50%,transparent_75%,transparent_100%)] bg-[size:40px_40px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Textile Color Themed Orbs - Warm colors (cotton, fabric colors) */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Thread/Weave Lines Effect */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            animate={{ y: [0, 100, 200, 300, 400, 500, 600, 700, 800, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"
            animate={{ y: [200, 300, 400, 500, 600, 700, 800, 0, 100, 200] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-md w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Login Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Header */}
          <motion.div className="text-center mb-10" variants={itemVariants}>
            {/* Logo with Textile Theme */}
            <motion.div
              className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl mb-6 shadow-2xl relative overflow-hidden"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              {/* Textile Pattern Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl opacity-75 blur-xl" />
              {/* Textile/Thread Icon */}
              <div className="relative z-10 flex flex-col items-center">
                <FiLayers className="w-8 h-8 text-white mb-1" />
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-white/80 rounded-full" />
                  <div className="w-1 h-4 bg-white/60 rounded-full" />
                  <div className="w-1 h-4 bg-white/80 rounded-full" />
                </div>
              </div>
            </motion.div>
            
            {/* Brand Name with Textile Theme */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h1 
                className="text-5xl font-extrabold mb-2"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Nool ERP
              </motion.h1>
              <motion.div
                className="flex items-center justify-center gap-2 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* <FiPackage className="w-4 h-4 text-amber-300" />
                <span className="text-xs text-amber-200 font-semibold tracking-wider uppercase">Textile Manufacturing ERP</span>
                <FiPackage className="w-4 h-4 text-amber-300" /> */}
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-white font-semibold text-lg mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t('auth.loginTitle') || 'Welcome Back'}
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <FiPackage className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200 font-semibold text-sm tracking-wide uppercase">Textile Manufacturing ERP</span>
              <FiPackage className="w-4 h-4 text-amber-300" />
            </motion.div>
            <motion.p 
              className="text-gray-200 text-sm mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Track fabric movement through multi-stage job-work vendors
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-4 mt-3 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="flex items-center gap-1.5 text-gray-200">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-medium">South India Focus</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-200 font-medium">WIP Tracking</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-200 font-medium">Process Loss</span>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-xl text-red-100 text-sm flex items-center gap-3"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-xs">⚠</span>
                </div>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                {t('auth.email') || 'Email Address'}
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === 'email' ? 'text-amber-400 scale-110' : 'text-gray-300'}`}>
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-gray-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all duration-300"
                  placeholder="admin@nool.com"
                />
                {focusedField === 'email' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                {t('auth.password') || 'Password'}
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === 'password' ? 'text-amber-400 scale-110' : 'text-gray-300'}`}>
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-gray-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-amber-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
                {focusedField === 'password' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-4 rounded-xl font-semibold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
              variants={itemVariants}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Textile pattern overlay */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>{t('common.loading') || 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-5 h-5" />
                    <span>{t('common.login') || 'Sign In'}</span>
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            className="mt-8 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-4">
              <FiShield className="w-4 h-4 text-amber-300" />
              <p className="text-sm font-semibold text-white">Demo Credentials</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {/* Admin */}
              <motion.div
                className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm p-3 rounded-xl border border-amber-500/30 cursor-pointer group hover:border-amber-400/50 transition-all"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setFormData({ email: 'admin@nool.com', password: 'admin123' });
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <p className="font-semibold text-amber-300 text-sm">Admin</p>
                  <FiTrendingUp className="w-3 h-3 text-amber-400 ml-auto" />
                </div>
                <p className="text-white text-xs font-mono">admin@nool.com</p>
                <p className="text-gray-200 text-xs mt-1">Full system access</p>
              </motion.div>

              {/* Supervisor */}
              <motion.div
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-3 rounded-xl border border-green-500/30 cursor-pointer group hover:border-green-400/50 transition-all"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setFormData({ email: 'supervisor@nool.com', password: 'supervisor123' });
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="font-semibold text-green-300 text-sm">Supervisor</p>
                </div>
                <p className="text-white text-xs font-mono">supervisor@nool.com</p>
                <p className="text-gray-200 text-xs mt-1">Operational management</p>
              </motion.div>

              {/* Vendor */}
              <motion.div
                className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm p-3 rounded-xl border border-red-500/30 cursor-pointer group hover:border-red-400/50 transition-all"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setFormData({ email: 'vendor@nool.com', password: 'vendor123' });
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <p className="font-semibold text-red-300 text-sm">Vendor</p>
                </div>
                <p className="text-white text-xs font-mono">vendor@nool.com</p>
                <p className="text-gray-200 text-xs mt-1">View own job orders</p>
              </motion.div>
            </div>
            <p className="text-gray-200 text-xs text-center mt-4 font-medium">Click any card to auto-fill credentials</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
