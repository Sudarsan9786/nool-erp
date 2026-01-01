import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Inventory = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventorySummary();
  }, []);

  const fetchInventorySummary = async () => {
    try {
      const response = await api.get('/materials/inventory/summary');
      setSummary(response.data.data || []);
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t('dashboard.inventorySummary')}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary.length === 0 ? (
          <div className={`col-span-full text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No inventory data available
          </div>
        ) : (
          summary.map((item, index) => (
            <div key={index} className="card">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{item._id}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Quantity:</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{item.totalQuantity}</span>
                </div>
                {item.locations.map((loc, locIndex) => (
                  <div key={locIndex} className={`p-2 rounded ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{loc.location}:</span>
                      <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{loc.quantity} ({loc.count} items)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;

