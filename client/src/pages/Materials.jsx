import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiPackage } from 'react-icons/fi';
import api from '../services/api';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

const Materials = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = authService.getStoredUser();
  const userRole = currentUser?.role || 'Supervisor';
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [filters, setFilters] = useState({
    materialType: '',
    currentLocation: '',
    search: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.materialType) params.append('materialType', filters.materialType);
      if (filters.currentLocation) params.append('currentLocation', filters.currentLocation);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/materials?${params.toString()}`);
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoMaterials = async () => {
    try {
      setSeeding(true);
      const response = await api.post('/materials/seed-demo');
      if (response.data.success) {
        alert(`Successfully created ${response.data.count} demo materials!`);
        fetchMaterials();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create demo materials';
      alert(message);
      console.error('Error seeding materials:', error);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t('common.materials')}</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {userRole === 'Admin' 
              ? 'Full material management - Create, edit, and delete materials'
              : 'Material management - Create and edit materials (Admin can delete)'}
          </p>
        </div>
        {/* Seed demo materials button - shown when no materials exist */}
        {materials.length === 0 && !loading && (userRole === 'Admin' || userRole === 'Supervisor') && (
          <motion.button
            onClick={seedDemoMaterials}
            disabled={seeding}
            className="btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {seeding ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FiRefreshCw className="w-5 h-5" />
                <span>Create Demo Materials</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('common.search')}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
              placeholder="Search materials..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('material.materialType')}
            </label>
            <select
              value={filters.materialType}
              onChange={(e) => setFilters({ ...filters, materialType: e.target.value })}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="Yarn">Yarn</option>
              <option value="Grey Fabric">Grey Fabric</option>
              <option value="Finished Fabric">Finished Fabric</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('material.currentLocation')}
            </label>
            <select
              value={filters.currentLocation}
              onChange={(e) => setFilters({ ...filters, currentLocation: e.target.value })}
              className="input-field"
            >
              <option value="">All Locations</option>
              <option value="Internal Warehouse">Internal Warehouse</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">{t('material.materialType')}</th>
                <th className="table-header-cell">{t('material.quantity')}</th>
                <th className="table-header-cell">{t('material.unit')}</th>
                <th className="table-header-cell">{t('material.currentLocation')}</th>
                <th className="table-header-cell">Vendor</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {materials.length === 0 && !loading ? (
                <tr>
                  <td colSpan="6" className="table-cell text-center py-12">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <FiPackage className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium text-lg mb-2">No materials found</p>
                      <p className="text-sm text-gray-400 mb-4">
                        {(userRole === 'Admin' || userRole === 'Supervisor')
                          ? 'Click "Create Demo Materials" to add sample materials for testing'
                          : 'Contact Admin/Supervisor to add materials'}
                      </p>
                      {(userRole === 'Admin' || userRole === 'Supervisor') && (
                        <motion.button
                          onClick={seedDemoMaterials}
                          disabled={seeding}
                          className="btn-primary inline-flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {seeding ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <span>Creating...</span>
                            </>
                          ) : (
                            <>
                              <FiRefreshCw className="w-5 h-5" />
                              <span>Create Demo Materials</span>
                            </>
                          )}
                        </motion.button>
                      )}
                    </motion.div>
                  </td>
                </tr>
              ) : (
                materials.map((material) => (
                  <tr key={material._id}>
                    <td className="table-cell font-medium">{material.name}</td>
                    <td className="table-cell">{material.materialType}</td>
                    <td className="table-cell">{material.quantity}</td>
                    <td className="table-cell">{material.unit}</td>
                    <td className="table-cell">{material.currentLocation}</td>
                    <td className="table-cell">{material.vendorId?.name || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Materials;

