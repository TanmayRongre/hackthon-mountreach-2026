// feeController.js
const getFees = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all fees' });
  } catch (error) {
    next(error);
  }
};

const getFeeById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get fee by id' });
  } catch (error) {
    next(error);
  }
};

const createFee = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Fee created' });
  } catch (error) {
    next(error);
  }
};

const updateFee = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Fee updated' });
  } catch (error) {
    next(error);
  }
};

const deleteFee = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Fee deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
};
