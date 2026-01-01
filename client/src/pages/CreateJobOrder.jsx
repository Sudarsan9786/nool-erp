import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const CreateJobOrder = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vendorId: '',
    jobWorkType: '',
    materialsIssued: [],
    expectedCompletionDate: '',
    serviceValue: '',
    taxRate: 5,
    notes: ''
  });
  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendors();
    fetchMaterials();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoadingData(true);
      const response = await api.get('/vendors?isActive=true');
      const vendorList = response.data.data || [];
      setVendors(vendorList);
      
      if (vendorList.length === 0) {
        setError('No vendors found. Please create a vendor first from the Vendors page.');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError('Failed to load vendors. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await api.get('/materials?currentLocation=Internal Warehouse');
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materialsIssued: [
        ...formData.materialsIssued,
        { materialId: '', materialType: '', quantity: '', unit: '' }
      ]
    });
  };

  const updateMaterial = (index, field, value) => {
    const updated = [...formData.materialsIssued];
    updated[index][field] = value;
    setFormData({ ...formData, materialsIssued: updated });
  };

  const removeMaterial = (index) => {
    const updated = formData.materialsIssued.filter((_, i) => i !== index);
    setFormData({ ...formData, materialsIssued: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/job-orders', formData);
      if (response.data.success) {
        navigate(`/job-orders/${response.data.data._id}`);
      } else {
        setError(response.data.message || 'Failed to create job order');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t('jobOrder.create')}</h1>
        </div>
      </div>

      {error && (
        <div className={`p-4 border rounded-lg ${
          theme === 'dark'
            ? 'bg-red-900/30 border-red-700 text-red-300'
            : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('jobOrder.vendor')} *
            </label>
            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              required
              disabled={loadingData || vendors.length === 0}
              className="input-field"
            >
              <option value="">
                {loadingData ? 'Loading vendors...' : vendors.length === 0 ? 'No vendors available' : 'Select Vendor'}
              </option>
              {vendors.map(vendor => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name} - {vendor.jobWorkType?.join(', ') || 'N/A'}
                </option>
              ))}
            </select>
            {vendors.length === 0 && !loadingData && (
              <p className="mt-2 text-sm text-amber-600">
                <a href="/vendors" className="underline hover:text-amber-700">Create a vendor first</a> to proceed.
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('jobOrder.jobWorkType')} *
            </label>
            <select
              name="jobWorkType"
              value={formData.jobWorkType}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Type</option>
              <option value="Knitting">Knitting</option>
              <option value="Dyeing">Dyeing</option>
              <option value="Printing">Printing</option>
              <option value="Stitching">Stitching</option>
              <option value="Finishing">Finishing</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('jobOrder.materialsIssued')} *
            </label>
            <button
              type="button"
              onClick={addMaterial}
              className="btn-secondary text-sm"
            >
              Add Material
            </button>
          </div>
          {formData.materialsIssued.map((material, index) => (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
            }`}>
              <select
                value={material.materialId}
                onChange={(e) => updateMaterial(index, 'materialId', e.target.value)}
                required
                disabled={materials.length === 0}
                className="input-field"
              >
                <option value="">
                  {materials.length === 0 ? 'No materials available' : 'Select Material'}
                </option>
                {materials.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.quantity} {m.unit})
                  </option>
                ))}
              </select>
              {materials.length === 0 && (
                <p className="text-sm text-amber-600 col-span-full mt-1">
                  No materials available. Please <a href="/materials" className="underline hover:text-amber-700">create materials</a> first or use the "Create Demo Materials" button on the Materials page.
                </p>
              )}
              <select
                value={material.materialType}
                onChange={(e) => updateMaterial(index, 'materialType', e.target.value)}
                required
                className="input-field"
              >
                <option value="">Type</option>
                <option value="Yarn">Yarn</option>
                <option value="Grey Fabric">Grey Fabric</option>
                <option value="Finished Fabric">Finished Fabric</option>
              </select>
              <input
                type="number"
                value={material.quantity}
                onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                placeholder="Quantity"
                required
                min="0"
                step="0.01"
                className="input-field"
              />
              <select
                value={material.unit}
                onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                required
                className="input-field"
              >
                <option value="">Unit</option>
                <option value="kg">kg</option>
                <option value="meters">meters</option>
                <option value="pieces">pieces</option>
              </select>
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="btn-secondary text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {formData.materialsIssued.length === 0 && (
            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No materials added. Click "Add Material" to add.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('jobOrder.expectedCompletion')}
            </label>
            <input
              type="date"
              name="expectedCompletionDate"
              value={formData.expectedCompletionDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Service Value
            </label>
            <input
              type="number"
              name="serviceValue"
              value={formData.serviceValue}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="input-field"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/job-orders')}
            className="btn-secondary"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading || formData.materialsIssued.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('common.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobOrder;

