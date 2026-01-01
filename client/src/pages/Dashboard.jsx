import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiFileText,
  FiUsers,
  FiTrendingDown,
  FiPlus,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiInbox,
  FiCheckSquare
} from 'react-icons/fi';
import api from '../services/api';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = authService.getStoredUser();
  const userRole = currentUser?.role || 'Supervisor';
  const [stats, setStats] = useState({
    materialAtVendor: 0,
    totalJobOrders: 0,
    activeVendors: 0,
    processLoss: 0
  });
  const [recentJobOrders, setRecentJobOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      let jobOrdersRes;
      
      // Vendor users only see their own job orders
      if (userRole === 'Vendor') {
        jobOrdersRes = await api.get(`/job-orders?vendorId=${currentUser.vendorId}&status=Sent,In-Process`);
      } else {
        jobOrdersRes = await api.get('/job-orders?status=Sent,In-Process');
      }
      
      const jobOrders = jobOrdersRes.data.data || [];

      // Only Admin and Supervisor see materials and vendors stats
      let materialsRes = { data: { data: [] } };
      let vendorsRes = { data: { data: [] } };
      
      if (userRole === 'Admin' || userRole === 'Supervisor') {
        materialsRes = await api.get('/materials?currentLocation=Vendor');
        vendorsRes = await api.get('/vendors?isActive=true');
      }

      const materials = materialsRes.data.data || [];
      const vendors = vendorsRes.data.data || [];

      const materialAtVendor = materials.reduce((sum, m) => sum + m.quantity, 0);
      const totalJobOrders = jobOrders.length;
      const activeVendors = vendors.length;

      const completedOrders = jobOrders.filter(jo => jo.processLoss?.calculated);
      const avgProcessLoss = completedOrders.length > 0
        ? completedOrders.reduce((sum, jo) => sum + jo.processLoss.percentage, 0) / completedOrders.length
        : 0;

      setStats({
        materialAtVendor,
        totalJobOrders,
        activeVendors,
        processLoss: avgProcessLoss
      });

      setRecentJobOrders(jobOrders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Role-based stat cards
  const getStatCards = () => {
    const baseCards = [
      {
        title: t('dashboard.totalJobOrders'),
        value: stats.totalJobOrders,
        unit: userRole === 'Vendor' ? 'my orders' : 'orders',
        icon: FiFileText,
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600'
      }
    ];

    // Admin and Supervisor see additional stats
    if (userRole === 'Admin' || userRole === 'Supervisor') {
      baseCards.push(
        {
          title: t('dashboard.materialAtVendor'),
          value: stats.materialAtVendor.toLocaleString(),
          unit: 'units',
          icon: FiPackage,
          color: 'from-amber-500 to-orange-500',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-600'
        },
        {
          title: t('dashboard.activeVendors'),
          value: stats.activeVendors,
          unit: 'vendors',
          icon: FiUsers,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600'
        },
        {
          title: t('dashboard.processLoss'),
          value: stats.processLoss.toFixed(2),
          unit: '%',
          icon: FiTrendingDown,
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600'
        }
      );
    } else {
      // Vendor sees their specific stats
      baseCards.push(
        {
          title: 'Pending Receipt',
          value: recentJobOrders.filter(jo => jo.status === 'Sent').length,
          unit: 'orders',
          icon: FiInbox,
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600'
        },
        {
          title: 'In Process',
          value: recentJobOrders.filter(jo => jo.status === 'In-Process').length,
          unit: 'orders',
          icon: FiClock,
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600'
        },
        {
          title: 'Completed',
          value: recentJobOrders.filter(jo => jo.status === 'Completed').length,
          unit: 'orders',
          icon: FiCheckSquare,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600'
        }
      );
    }

    return baseCards;
  };

  const statCards = getStatCards();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'In-Process':
        return <FiClock className="w-5 h-5 text-orange-500" />;
      default:
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In-Process':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Partially Returned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return theme === 'dark' ? 'bg-slate-700 text-gray-200 border-slate-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">{t('common.loading')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center flex-wrap gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {userRole === 'Vendor' ? 'My Dashboard' : t('dashboard.title')}
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {userRole === 'Admin' && 'Full system access - Manage everything including users and system settings'}
            {userRole === 'Supervisor' && 'Operational management - Create job orders, manage vendors (no delete), track materials'}
            {userRole === 'Vendor' && 'Track your job orders and update status'}
          </p>
        </div>
        {/* Only Admin and Supervisor can create job orders */}
        {(userRole === 'Admin' || userRole === 'Supervisor') && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/job-orders/create" className="btn-primary flex items-center gap-2">
              <FiPlus className="w-5 h-5" />
              {t('jobOrder.create')}
            </Link>
          </motion.div>
        )}
        {/* Vendor sees different CTA */}
        {userRole === 'Vendor' && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/job-orders" className="btn-primary flex items-center gap-2">
              <FiInbox className="w-5 h-5" />
              View My Orders
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="stat-card group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full ${stat.bgColor} ${stat.textColor} text-xs font-semibold`}>
                  {stat.unit}
                </div>
              </div>
              <div>
                <p className={`text-sm mb-1 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Job Orders */}
      <motion.div className="card" variants={itemVariants}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{t('dashboard.recentJobOrders')}</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Latest job orders and their status</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/job-orders"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm"
            >
              View all
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        {recentJobOrders.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No recent job orders</p>
            <p className="text-sm text-gray-500 mt-1">Create your first job order to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">{t('jobOrder.jobOrderNumber')}</th>
                  <th className="table-header-cell">{t('jobOrder.vendor')}</th>
                  <th className="table-header-cell">{t('jobOrder.jobWorkType')}</th>
                  <th className="table-header-cell">{t('common.status')}</th>
                  <th className="table-header-cell">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {recentJobOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    className="table-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="table-cell font-semibold">{order.jobOrderNumber}</td>
                    <td className="table-cell">{order.vendorId?.name || 'N/A'}</td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-slate-700 text-gray-200 rounded-md text-xs font-medium">
                        {order.jobWorkType}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/job-orders/${order._id}`}
                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group"
                      >
                        View
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
