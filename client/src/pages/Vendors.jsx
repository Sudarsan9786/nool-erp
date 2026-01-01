import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus, FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

const Vendors = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    jobWorkType: '',
    search: ''
  });

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.jobWorkType) params.append('jobWorkType', filters.jobWorkType);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/vendors?${params.toString()}`);
      setVendors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoVendors = async () => {
    try {
      setSeeding(true);
      const response = await api.post('/vendors/seed-demo');
      if (response.data.success) {
        alert(`Successfully created ${response.data.count} demo vendors!`);
        fetchVendors();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create demo vendors';
      alert(message);
      console.error('Error seeding vendors:', error);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t('common.vendors')}</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {user?.role === 'Admin' 
              ? 'Full vendor management - Create, edit, and delete vendors'
              : user?.role === 'Supervisor'
              ? 'Vendor management - Create and edit vendors (Admin can delete)'
              : 'View vendor information'}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Both Admin and Supervisor can create vendors */}
          {(user?.role === 'Admin' || user?.role === 'Supervisor') && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/vendors/create" className="btn-primary flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                Add Vendor
              </Link>
            </motion.div>
          )}
          {/* Demo vendors button - available to both Admin and Supervisor */}
          {vendors.length === 0 && (user?.role === 'Admin' || user?.role === 'Supervisor') && (
            <motion.button
              onClick={seedDemoVendors}
              disabled={seeding}
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {seeding ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-5 h-5" />
                  <span>Create Demo Vendors</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('common.search')}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
              placeholder="Search vendors..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('jobOrder.jobWorkType')}
            </label>
            <select
              value={filters.jobWorkType}
              onChange={(e) => setFilters({ ...filters, jobWorkType: e.target.value })}
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
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.length === 0 && !loading ? (
          <motion.div
            className="col-span-full card text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg mb-2">No vendors found</p>
            <p className="text-sm text-gray-400 mb-4">
              {(user?.role === 'Admin' || user?.role === 'Supervisor') 
                ? 'Click "Add Vendor" to create a new vendor or create demo vendors'
                : 'Contact Admin/Supervisor to create vendors'}
            </p>
            {(user?.role === 'Admin' || user?.role === 'Supervisor') && (
              <div className="flex gap-3 justify-center">
                <Link to="/vendors/create" className="btn-primary inline-flex items-center gap-2">
                  <FiPlus className="w-5 h-5" />
                  Add Vendor
                </Link>
                <button
                  onClick={seedDemoVendors}
                  disabled={seeding}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  {seeding ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="w-5 h-5" />
                      <span>Create Demo Vendors</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        ) : loading ? (
          <div className="col-span-full text-center py-12">
            <motion.div
              className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 mt-4">{t('common.loading')}</p>
          </div>
        ) : (
          vendors.map((vendor) => (
            <div key={vendor._id} className="card">
              <h3 className="text-lg font-semibold mb-2">{vendor.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Contact:</strong> {vendor.contactPerson}</p>
                <p><strong>Phone:</strong> {vendor.phone}</p>
                <p><strong>Job Work Types:</strong> {vendor.jobWorkType.join(', ')}</p>
                {vendor.gstin && <p><strong>GSTIN:</strong> {vendor.gstin}</p>}
                <p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Vendors;

