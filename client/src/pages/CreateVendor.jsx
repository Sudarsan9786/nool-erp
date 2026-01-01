import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const CreateVendor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    address: {
      street: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: '',
      country: 'India'
    },
    jobWorkType: [],
    gstin: '',
    pan: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: ''
    },
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleJobWorkTypeChange = (jobType) => {
    setFormData(prev => {
      const jobWorkType = prev.jobWorkType.includes(jobType)
        ? prev.jobWorkType.filter(t => t !== jobType)
        : [...prev.jobWorkType, jobType];
      return { ...prev, jobWorkType };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.contactPerson || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.jobWorkType.length === 0) {
      setError('Please select at least one job work type');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/vendors', formData);
      if (response.data.success) {
        navigate('/vendors');
      } else {
        setError(response.data.message || 'Failed to create vendor');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const jobWorkTypes = ['Knitting', 'Dyeing', 'Printing', 'Stitching', 'Finishing'];

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/vendors')}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
          }`}
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create New Vendor</h1>
          <p className="text-gray-600">Add a new vendor to your network</p>
        </div>
      </div>

      {error && (
        <motion.div
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="ABC Dyeing Works"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Raj Kumar"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="+919876543210"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="+919876543210"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="contact@vendor.com"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="input-field"
                placeholder="123 Textile Street"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="input-field"
                placeholder="Tirupur"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="input-field"
                placeholder="Tamil Nadu"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Pincode
              </label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                className="input-field"
                placeholder="641601"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Country
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="input-field"
                placeholder="India"
              />
            </div>
          </div>
        </div>

        {/* Job Work Types */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Job Work Types <span className="text-red-500">*</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {jobWorkTypes.map((type) => (
              <label
                key={type}
                className={`flex items-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.jobWorkType.includes(type)
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.jobWorkType.includes(type)}
                  onChange={() => handleJobWorkTypeChange(type)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{type}</span>
              </label>
            ))}
          </div>
          {formData.jobWorkType.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one job work type</p>
          )}
        </div>

        {/* Tax Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                GSTIN
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="input-field"
                placeholder="33AAAAA0000A1Z5"
                maxLength={15}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                PAN
              </label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                className="input-field"
                placeholder="AAAAA0000A"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Account Number
              </label>
              <input
                type="text"
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                IFSC Code
              </label>
              <input
                type="text"
                name="bankDetails.ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={handleChange}
                className="input-field"
                placeholder="SBIN0001234"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Bank Name
              </label>
              <input
                type="text"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
                className="input-field"
                placeholder="State Bank of India"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Branch
              </label>
              <input
                type="text"
                name="bankDetails.branch"
                value={formData.bankDetails.branch}
                onChange={handleChange}
                className="input-field"
                placeholder="Tirupur Main Branch"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              Active Vendor (can receive job orders)
            </span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/vendors')}
            className="btn-secondary flex items-center gap-2"
          >
            <FiX className="w-4 h-4" />
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading || formData.jobWorkType.length === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
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
                <FiSave className="w-4 h-4" />
                <span>Create Vendor</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateVendor;

