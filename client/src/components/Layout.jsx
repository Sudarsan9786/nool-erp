import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout,
  FiFileText,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiInbox,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load from localStorage or default to false (expanded)
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Get current user role
  const currentUser = user || authService.getStoredUser();
  const userRole = currentUser?.role || 'Supervisor';

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Determine if sidebar should show expanded content (either not collapsed OR hovered when collapsed)
  const isExpanded = !sidebarCollapsed || sidebarHovered;

  // Role-based navigation
  const getNavigation = () => {
    const baseNav = [
      { name: t('common.dashboard'), href: '/dashboard', icon: FiLayout, color: 'text-amber-600' },
      { name: userRole === 'Vendor' ? 'My Orders' : t('common.jobOrders'), href: '/job-orders', icon: FiFileText, color: 'text-green-600' },
    ];

    // Admin and Supervisor see additional menu items
    if (userRole === 'Admin' || userRole === 'Supervisor') {
      baseNav.push(
        { name: t('common.materials'), href: '/materials', icon: FiPackage, color: 'text-purple-600' },
        { name: t('common.vendors'), href: '/vendors', icon: FiUsers, color: 'text-orange-600' },
        { name: t('common.inventory'), href: '/inventory', icon: FiBarChart2, color: 'text-indigo-600' }
      );
    }

    // Only Admin sees Users management (future feature)
    // if (userRole === 'Admin') {
    //   baseNav.push(
    //     { name: 'Users', href: '/users', icon: FiUser, color: 'text-red-600' }
    //   );
    // }

    return baseNav;
  };

  const navigation = getNavigation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50'
    }`}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className={`fixed inset-y-0 left-0 flex w-72 flex-col shadow-2xl z-50 lg:hidden border-r transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
                <div className="flex h-20 items-center justify-between px-6 border-b border-slate-700 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
                  <div className="flex items-center gap-2">
                    <FiPackage className="w-5 h-5 text-white" />
                    <h1 className="text-2xl font-bold text-white">Nool ERP</h1>
                    <span className="text-xs text-white/80 font-medium">Textile</span>
                  </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg'
                            : theme === 'dark'
                              ? 'text-gray-300 hover:bg-slate-700/50'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : item.color}`} />
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col z-30"
        initial={false}
        animate={{
          width: sidebarCollapsed && !sidebarHovered ? 80 : 288
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => {
          if (sidebarCollapsed) {
            setSidebarHovered(true);
          }
        }}
        onMouseLeave={() => {
          setSidebarHovered(false);
        }}
      >
        <motion.div
          className={`flex flex-col flex-grow shadow-xl relative h-full border-r transition-colors ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}
          layout
        >
          {/* Header */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-slate-700 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="title"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiPackage className="w-5 h-5 text-white" />
                  <h1 className="text-2xl font-bold text-white whitespace-nowrap">Nool ERP</h1>
                  <span className="text-xs text-white/80 font-medium">Textile</span>
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiPackage className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group relative ${
                      active
                        ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-slate-700/50'
                          : 'text-gray-700 hover:bg-gray-100'
                    } ${!isExpanded ? 'justify-center' : ''}`}
                    title={!isExpanded ? item.name : ''}
                  >
                    <Icon className={`w-5 h-5 ${isExpanded ? 'mr-3' : ''} transition-all ${
                      active ? 'text-white' : item.color
                    }`} />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Tooltip for collapsed state (only show when sidebar is collapsed and not being hovered to expand) */}
                    {sidebarCollapsed && !sidebarHovered && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.name}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="lg:pl-72"
        initial={false}
        animate={{
          paddingLeft: sidebarCollapsed && !sidebarHovered ? 80 : 288
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top bar */}
        <motion.header
          className={`sticky top-0 z-10 flex h-20 items-center justify-between backdrop-blur-md border-b px-4 shadow-lg transition-colors ${
            theme === 'dark'
              ? 'bg-slate-800/90 border-slate-700'
              : 'bg-white/80 border-gray-200'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden transition-colors p-2 rounded-lg ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors border ${
                theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white border-slate-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </motion.button>
            
            {/* Language switcher */}
            <div className={`flex items-center space-x-2 rounded-lg p-1 border transition-colors ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600'
                : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  i18n.language === 'en'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('ta')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  i18n.language === 'ta'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                    : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className={`text-sm font-semibold flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  <FiUser className="w-4 h-4" />
                  {user?.name}
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user?.role}</div>
              </div>
              <motion.button
                onClick={onLogout}
                className="btn-secondary flex items-center gap-2 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLogOut className="w-4 h-4" />
                {t('common.logout')}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
