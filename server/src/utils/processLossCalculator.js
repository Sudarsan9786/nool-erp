/**
 * Process Loss Calculator Utility
 * Calculates shrinkage/loss percentage when materials are processed
 * Example: 100kg Yarn -> 92kg Fabric = 8% loss
 */

export const calculateProcessLoss = (issuedQuantity, receivedQuantity, unit = 'kg') => {
  if (!issuedQuantity || issuedQuantity <= 0) {
    throw new Error('Issued quantity must be greater than 0');
  }

  if (receivedQuantity < 0) {
    throw new Error('Received quantity cannot be negative');
  }

  if (receivedQuantity > issuedQuantity) {
    // This might indicate an error or additional materials added
    return {
      loss: 0,
      lossPercentage: 0,
      receivedQuantity,
      issuedQuantity,
      unit,
      warning: 'Received quantity exceeds issued quantity'
    };
  }

  const loss = issuedQuantity - receivedQuantity;
  const lossPercentage = (loss / issuedQuantity) * 100;

  return {
    loss,
    lossPercentage: parseFloat(lossPercentage.toFixed(2)),
    receivedQuantity,
    issuedQuantity,
    unit,
    isWithinTolerance: lossPercentage <= 10 // Default tolerance: 10%
  };
};

/**
 * Calculate process loss for multiple materials in a job order
 */
export const calculateJobOrderProcessLoss = (materialsIssued, materialsReceived) => {
  const results = [];
  let totalIssued = 0;
  let totalReceived = 0;

  materialsIssued.forEach(issued => {
    const received = materialsReceived.find(
      rec => rec.materialId.toString() === issued.materialId.toString()
    );

    if (received) {
      const calculation = calculateProcessLoss(
        issued.quantity,
        received.quantity,
        issued.unit
      );
      
      results.push({
        materialId: issued.materialId,
        materialType: issued.materialType,
        ...calculation
      });

      // Convert to common unit for total calculation (simplified - assumes same unit)
      if (issued.unit === received.unit) {
        totalIssued += issued.quantity;
        totalReceived += received.quantity;
      }
    }
  });

  const overallLoss = totalIssued > 0 
    ? ((totalIssued - totalReceived) / totalIssued) * 100 
    : 0;

  return {
    materialWiseLoss: results,
    overallLossPercentage: parseFloat(overallLoss.toFixed(2)),
    totalIssued,
    totalReceived,
    flagHighLoss: overallLoss > 10
  };
};

export default {
  calculateProcessLoss,
  calculateJobOrderProcessLoss
};

