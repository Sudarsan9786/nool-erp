import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Challan Generator Utility
 * Generates PDF Delivery Challan (Form ITC-04) for goods moving to job-work
 */

/**
 * Generate QR code for job order
 */
const generateQRCode = async (jobOrderNumber) => {
  try {
    const qrData = JSON.stringify({
      jobOrderNumber,
      type: 'job-order',
      timestamp: new Date().toISOString()
    });
    return await QRCode.toDataURL(qrData);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

/**
 * Generate Delivery Challan PDF
 * @param {object} jobOrder - Job order object
 * @param {object} vendor - Vendor object
 * @param {object} materials - Materials array
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateChallanPDF = async (jobOrder, vendor, materials) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('DELIVERY CHALLAN', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text('Form ITC-04 - Goods Sent for Job Work', { align: 'center' });
      doc.moveDown(2);

      // Company Details
      doc.fontSize(14).text('From:', { underline: true });
      doc.fontSize(10).text('Nool Textiles ERP');
      doc.text('Tirupur/Erode Cluster');
      doc.text('Tamil Nadu, India');
      doc.moveDown();

      // Vendor Details
      doc.fontSize(14).text('To:', { underline: true });
      doc.fontSize(10).text(vendor.name);
      doc.text(`Contact: ${vendor.contactPerson}`);
      doc.text(`Phone: ${vendor.phone}`);
      if (vendor.address) {
        doc.text(`${vendor.address.street || ''}, ${vendor.address.city || ''}`);
        doc.text(`${vendor.address.state || ''} - ${vendor.address.pincode || ''}`);
      }
      if (vendor.gstin) {
        doc.text(`GSTIN: ${vendor.gstin}`);
      }
      doc.moveDown();

      // Challan Details
      doc.fontSize(14).text('Challan Details:', { underline: true });
      doc.fontSize(10);
      doc.text(`Challan Number: ${jobOrder.challanNumber || jobOrder.jobOrderNumber}`);
      doc.text(`Date: ${new Date(jobOrder.challanDate || Date.now()).toLocaleDateString('en-IN')}`);
      doc.text(`Job Order Number: ${jobOrder.jobOrderNumber}`);
      doc.text(`Job Work Type: ${jobOrder.jobWorkType}`);
      doc.moveDown();

      // Materials Issued Section - Key-Value Pair Format
      const materialsStartY = doc.y;
      doc.fontSize(12).text('Materials Issued:', { underline: true });
      doc.moveDown(0.5);
      
      // Position QR code on the right side
      const qrSize = 80;
      const qrX = 420; // Right side of page
      const qrY = materialsStartY;
      
      // Generate QR code
      const qrCode = await generateQRCode(jobOrder.jobOrderNumber);
      if (qrCode) {
        doc.image(qrCode, qrX, qrY, { width: qrSize, height: qrSize });
        // Add label below QR code
        doc.fontSize(8).font('Helvetica');
        const labelY = qrY + qrSize + 5;
        doc.text('Scan for', qrX, labelY, { width: qrSize, align: 'center' });
        doc.text('Job Order', qrX, labelY + 10, { width: qrSize, align: 'center' });
      }
      
      // Materials List - Key-Value Pair Format
      doc.fontSize(10).font('Helvetica');
      const materialsList = materials || [];
      let currentY = doc.y;
      
      if (materialsList.length === 0) {
        doc.text('No materials issued', 50, currentY);
        currentY += 15;
      } else {
        materialsList.forEach((materialItem, index) => {
          // Check if we need a new page
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }
          
          // Extract material data
          const materialType = materialItem.materialType || '-';
          const materialName = materialItem.name || materialItem.description || '-';
          const quantity = materialItem.quantity || 0;
          const unit = materialItem.unit || '-';
          
          // Format quantity
          let qtyStr;
          const qtyNum = parseFloat(quantity);
          if (qtyNum % 1 === 0) {
            qtyStr = String(qtyNum);
          } else {
            qtyStr = qtyNum.toFixed(2);
          }
          
          // Display as key-value pairs
          doc.font('Helvetica-Bold');
          doc.text(`${index + 1}. Material ${index + 1}:`, 50, currentY);
          
          doc.font('Helvetica');
          currentY += 15;
          doc.text(`   Type: ${materialType}`, 50, currentY);
          currentY += 12;
          doc.text(`   Name: ${materialName}`, 50, currentY);
          currentY += 12;
          doc.text(`   Quantity: ${qtyStr} ${unit}`, 50, currentY);
          currentY += 18; // Extra space between materials
        });
      }
      
      // Set Y position after materials (ensure it's below QR code if needed)
      const qrBottomY = qrCode ? qrY + qrSize + 35 : 0;
      doc.y = Math.max(currentY + 10, qrBottomY);

      // Footer
      doc.moveDown(2);
      doc.fontSize(10);
      doc.text('Terms & Conditions:', { underline: true });
      doc.text('1. Goods are sent for job work only.');
      doc.text('2. Materials must be returned within the specified time period.');
      doc.text('3. Process loss will be calculated on receipt.');
      doc.moveDown();
      doc.text('Authorized Signature', 50, doc.y);
      doc.text('Receiver Signature', 350, doc.y);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  generateChallanPDF,
  generateQRCode
};

