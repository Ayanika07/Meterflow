import Billing from "../models/Billing.js";
import UsageLog from "../models/UsageLog.js";

// Generate bill for a user's API
export const generateBill = async (req, res) => {
  try {
    const { apiId } = req.params;
    const userId = req.user.id;

    // Define billing period (current month)
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Count total requests in this period
    const totalRequests = await UsageLog.countDocuments({
      userId,
      apiId,
      createdAt: { $gte: periodStart, $lte: periodEnd }
    });

    // Billing logic
    const freeLimit = 1000;
    const pricePerHundred = 0.5;

    const billableRequests = Math.max(0, totalRequests - freeLimit);
    const totalAmount = (billableRequests / 100) * pricePerHundred;

    // Check if bill already exists for this period
    let bill = await Billing.findOne({
      userId,
      apiId,
      billingPeriodStart: periodStart
    });

    if (bill) {
      // Update existing bill
      bill.totalRequests = totalRequests;
      bill.billableRequests = billableRequests;
      bill.totalAmount = totalAmount;
      await bill.save();
    } else {
      // Create new bill
      bill = await Billing.create({
        userId,
        apiId,
        totalRequests,
        freeLimit,
        pricePerHundred,
        billableRequests,
        totalAmount,
        billingPeriodStart: periodStart,
        billingPeriodEnd: periodEnd
      });
    }

    res.json({
      message: "Bill generated",
      bill,
      breakdown: {
        totalRequests,
        freeRequests: Math.min(totalRequests, freeLimit),
        billableRequests,
        pricePerHundred: `₹${pricePerHundred}`,
        totalAmount: `₹${totalAmount.toFixed(2)}`
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bills for logged in user
export const getMyBills = async (req, res) => {
  try {
    const bills = await Billing.find({ userId: req.user.id })
      .populate("apiId", "name baseUrl")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bill summary across all APIs
export const getBillingSummary = async (req, res) => {
  try {
    const bills = await Billing.find({ userId: req.user.id })
      .populate("apiId", "name");

    const totalDue = bills
      .filter(b => b.status === "unpaid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalPaid = bills
      .filter(b => b.status === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      totalBills: bills.length,
      totalDue: `₹${totalDue.toFixed(2)}`,
      totalPaid: `₹${totalPaid.toFixed(2)}`,
      bills
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark bill as paid
export const markAsPaid = async (req, res) => {
  try {
    const bill = await Billing.findOneAndUpdate(
      { _id: req.params.billId, userId: req.user.id },
      { status: "paid" },
      { new: true }
    );

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    res.json({ message: "Bill marked as paid", bill });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};