import twilio from 'twilio';

/**
 * WhatsApp Notification Service
 * Sends notifications to vendors when a Job Order is assigned
 */

let twilioClient = null;

/**
 * Initialize Twilio client
 */
const initTwilio = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return twilioClient;
};

/**
 * Send WhatsApp notification to vendor
 * @param {string} phoneNumber - Vendor WhatsApp number (with country code)
 * @param {object} jobOrder - Job order details
 * @param {object} vendor - Vendor details
 * @returns {Promise<object>} - Notification result
 */
export const sendJobOrderNotification = async (phoneNumber, jobOrder, vendor) => {
  try {
    // Format phone number (ensure it starts with country code)
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber.replace(/^0/, '')}`;

    const message = `
🎯 *New Job Order Assigned*

*Job Order Number:* ${jobOrder.jobOrderNumber}
*Job Work Type:* ${jobOrder.jobWorkType}
*Status:* ${jobOrder.status}

*Materials Issued:*
${jobOrder.materialsIssued.map((m, i) => 
  `${i + 1}. ${m.materialType}: ${m.quantity} ${m.unit}`
).join('\n')}

*Expected Completion:* ${jobOrder.expectedCompletionDate 
  ? new Date(jobOrder.expectedCompletionDate).toLocaleDateString('en-IN')
  : 'Not specified'}

Please acknowledge receipt of materials.

Thank you,
Nool ERP System
    `.trim();

    const client = initTwilio();
    
    if (!client) {
      // Mock service - log instead of sending
      console.log('📱 WhatsApp Notification (Mock):');
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${message}`);
      return {
        success: true,
        mock: true,
        message: 'WhatsApp notification logged (Twilio not configured)',
        phoneNumber: formattedPhone
      };
    }

    // Send via Twilio
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    if (!twilioPhone) {
      throw new Error('Twilio phone number not configured');
    }

    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${formattedPhone}`
    });

    return {
      success: true,
      mock: false,
      messageSid: result.sid,
      phoneNumber: formattedPhone,
      status: result.status
    };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return {
      success: false,
      error: error.message,
      phoneNumber
    };
  }
};

/**
 * Send material receipt confirmation
 */
export const sendReceiptConfirmation = async (phoneNumber, jobOrder, receivedMaterials) => {
  try {
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber.replace(/^0/, '')}`;

    const message = `
✅ *Material Receipt Confirmed*

*Job Order:* ${jobOrder.jobOrderNumber}

*Materials Received:*
${receivedMaterials.map((m, i) => 
  `${i + 1}. ${m.materialType}: ${m.quantity} ${m.unit}`
).join('\n')}

Thank you for the update.

Nool ERP System
    `.trim();

    const client = initTwilio();
    
    if (!client) {
      console.log('📱 WhatsApp Receipt Confirmation (Mock):');
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${message}`);
      return { success: true, mock: true };
    }

    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${formattedPhone}`
    });

    return {
      success: true,
      messageSid: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Error sending receipt confirmation:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendJobOrderNotification,
  sendReceiptConfirmation
};

