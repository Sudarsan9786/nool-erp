/**
 * GST Calculator Utility
 * Handles CGST/SGST/IGST calculation for job-work services
 * Default tax rate: 5% as per 2026 textile norms
 */

/**
 * Determine GST type based on vendor location
 * CGST + SGST for same state, IGST for different state
 * @param {string} vendorState - State of the vendor
 * @param {string} companyState - State of the company (default: Tamil Nadu)
 * @returns {string} - 'intrastate' or 'interstate'
 */
export const determineGSTType = (vendorState, companyState = 'Tamil Nadu') => {
  return vendorState === companyState ? 'intrastate' : 'interstate';
};

/**
 * Calculate GST for job-work services
 * @param {number} serviceValue - Base value of the service
 * @param {number} taxRate - Tax rate percentage (default: 5%)
 * @param {string} gstType - 'intrastate' or 'interstate'
 * @returns {object} - GST breakdown
 */
export const calculateGST = (serviceValue, taxRate = 5, gstType = 'intrastate') => {
  if (serviceValue < 0) {
    throw new Error('Service value cannot be negative');
  }

  const taxAmount = (serviceValue * taxRate) / 100;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (gstType === 'intrastate') {
    // CGST + SGST (split equally)
    cgst = taxAmount / 2;
    sgst = taxAmount / 2;
  } else {
    // IGST (full amount)
    igst = taxAmount;
  }

  const totalAmount = serviceValue + taxAmount;

  return {
    serviceValue: parseFloat(serviceValue.toFixed(2)),
    taxRate: parseFloat(taxRate.toFixed(2)),
    cgst: parseFloat(cgst.toFixed(2)),
    sgst: parseFloat(sgst.toFixed(2)),
    igst: parseFloat(igst.toFixed(2)),
    totalTax: parseFloat(taxAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    gstType
  };
};

/**
 * Calculate GST for a job order
 * @param {object} jobOrder - Job order object with vendor and service value
 * @param {number} serviceValue - Service value
 * @param {number} taxRate - Tax rate (default: 5%)
 * @returns {object} - GST details
 */
export const calculateJobOrderGST = (jobOrder, serviceValue, taxRate = 5) => {
  // In a real scenario, you'd fetch vendor state from the vendor document
  // For now, assuming Tamil Nadu (Tirupur/Erode cluster)
  const vendorState = jobOrder.vendorId?.state || 'Tamil Nadu';
  const companyState = 'Tamil Nadu';
  
  const gstType = determineGSTType(vendorState, companyState);
  const gstDetails = calculateGST(serviceValue, taxRate, gstType);

  return {
    ...gstDetails,
    vendorState,
    companyState
  };
};

export default {
  determineGSTType,
  calculateGST,
  calculateJobOrderGST
};

