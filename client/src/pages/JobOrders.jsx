import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiPlus, FiArrowRight, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

const JobOrders = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = authService.getStoredUser();
  const userRole = currentUser?.role || 'Supervisor';
  const [jobOrders, setJobOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    jobWorkType: '',
    search: ''
  });

  useEffect(() => {
    fetchJobOrders();
  }, [filters]);

  const fetchJobOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.jobWorkType) params.append('jobWorkType', filters.jobWorkType);
      
      // Vendor users only see their own job orders
      if (userRole === 'Vendor' && currentUser?.vendorId) {
        params.append('vendorId', currentUser.vendorId);
      }

      const response = await api.get(`/job-orders?${params.toString()}`);
      let orders = response.data.data || [];

      if (filters.search) {
        orders = orders.filter(order =>
          order.jobOrderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          order.vendorId?.name?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setJobOrders(orders);
    } catch (error) {
      console.error('Error fetching job orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'In-Process':
        return <FiClock className="w-4 h-4" />;
      default:
        return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    if (theme === 'dark') {
      switch (status) {
        case 'Completed':
          return 'bg-green-900/50 text-green-300 border-green-700';
        case 'In-Process':
          return 'bg-orange-900/50 text-orange-300 border-orange-700';
        case 'Partially Returned':
          return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
        default:
          return 'bg-slate-700 text-gray-200 border-slate-600';
      }
    } else {
      switch (status) {
        case 'Completed':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'In-Process':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Partially Returned':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {userRole === 'Vendor' ? 'My Job Orders' : t('common.jobOrders')}
          </h1>
          <p className="text-gray-600">
            {userRole === 'Vendor' ? 'Track your assigned job orders and update status' : 'Manage and track all your job orders'}
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
      </div>

      {/* Filters */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FiFilter className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.search')}
            </label>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-12"
                placeholder="Search by job order number or vendor..."
              />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('common.status')}
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="Sent">Sent</option>
              <option value="In-Process">In-Process</option>
              <option value="Partially Returned">Partially Returned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('jobOrder.jobWorkType')}
            </label>
            <select
              value={filters.jobWorkType}
              onChange={(e) => handleFilterChange('jobWorkType', e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="Knitting">Knitting</option>
              <option value="Dyeing">Dyeing</option>
              <option value="Printing">Printing</option>
              <option value="Stitching">Stitching</option>
              <option value="Finishing">Finishing</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Job Orders Table */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">{t('jobOrder.jobOrderNumber')}</th>
                <th className="table-header-cell">{t('jobOrder.vendor')}</th>
                <th className="table-header-cell">{t('jobOrder.jobWorkType')}</th>
                <th className="table-header-cell">{t('common.status')}</th>
                <th className="table-header-cell">Process Loss</th>
                <th className="table-header-cell">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {jobOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-cell text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <FiFilter className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-300'}`} />
                      <p className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No job orders found</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    className="table-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="table-cell font-semibold">{order.jobOrderNumber}</td>
                    <td className="table-cell">{order.vendorId?.name || 'N/A'}</td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
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
                      {order.processLoss?.calculated ? (
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          order.processLoss.percentage > 10
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {order.processLoss.percentage}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobOrders;
