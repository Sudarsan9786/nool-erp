import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const JobOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [jobOrder, setJobOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    materialsReceived: []
  });

  useEffect(() => {
    fetchJobOrder();
  }, [id]);

  const fetchJobOrder = async () => {
    try {
      const response = await api.get(`/job-orders/${id}`);
      setJobOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching job order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveMaterials = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/job-orders/${id}/receive`, receiveForm);
      if (response.data.success) {
        setShowReceiveForm(false);
        fetchJobOrder();
      }
    } catch (error) {
      console.error('Error receiving materials:', error);
    }
  };

  const downloadChallan = async () => {
    try {
      const response = await api.get(`/job-orders/${id}/challan`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `challan-${jobOrder.jobOrderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading challan:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  if (!jobOrder) {
    return <div className="text-center py-12">Job order not found</div>;
  }

  return (
    <div className="max-w-9xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <Link to="/job-orders" className={`text-sm mb-2 inline-block ${
            theme === 'dark' 
              ? 'text-amber-400 hover:text-amber-300' 
              : 'text-amber-600 hover:text-amber-700'
          }`}>
            ← Back to Job Orders
          </Link>
          <h1 className="text-3xl font-bold gradient-text mb-2">{jobOrder.jobOrderNumber}</h1>
        </div>
        <div className="flex space-x-2">
          <button onClick={downloadChallan} className="btn-secondary">
            {t('jobOrder.downloadChallan')}
          </button>
          {jobOrder.status !== 'Completed' && (
            <button
              onClick={() => setShowReceiveForm(!showReceiveForm)}
              className="btn-primary"
            >
              {t('jobOrder.receiveMaterials')}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Job Order Details</h2>
          <dl className="space-y-2">
            <div>
              <dt className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Vendor</dt>
              <dd className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{jobOrder.vendorId?.name}</dd>
            </div>
            <div>
              <dt className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Job Work Type</dt>
              <dd className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{jobOrder.jobWorkType}</dd>
            </div>
            <div>
              <dt className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</dt>
              <dd>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  theme === 'dark'
                    ? jobOrder.status === 'Completed' ? 'bg-green-900/50 text-green-300' :
                      jobOrder.status === 'In-Process' ? 'bg-orange-900/50 text-orange-300' :
                      'bg-yellow-900/50 text-yellow-300'
                    : jobOrder.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      jobOrder.status === 'In-Process' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                }`}>
                  {jobOrder.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Process Loss</dt>
              <dd className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                {jobOrder.processLoss?.calculated
                  ? `${jobOrder.processLoss.percentage}%`
                  : 'Not calculated'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Materials Issued</h2>
          <div className="space-y-2">
            {jobOrder.materialsIssued.map((material, index) => (
              <div key={index} className={`p-3 rounded ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <div className={`flex justify-between ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  <span className="font-medium">{material.materialType}</span>
                  <span>{material.quantity} {material.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {jobOrder.materialsReceived.length > 0 && (
        <div className="card">
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Materials Received</h2>
          <div className="space-y-2">
            {jobOrder.materialsReceived.map((material, index) => (
              <div key={index} className={`p-3 rounded ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <div className={`flex justify-between ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  <span className="font-medium">{material.materialType}</span>
                  <span>{material.quantity} {material.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showReceiveForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Receive Materials</h2>
          <form onSubmit={handleReceiveMaterials} className="space-y-4">
            {/* Simplified receive form - in production, this would be more comprehensive */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                This is a simplified form. In production, you would add materials received with quantities.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowReceiveForm(false)}
                className="btn-secondary"
              >
                {t('common.cancel')}
              </button>
              <button type="submit" className="btn-primary">
                {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobOrderDetail;

