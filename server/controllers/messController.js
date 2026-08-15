// messController.js
const getMesses = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all messes' });
  } catch (error) {
    next(error);
  }
};

const getMessById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get mess by id' });
  } catch (error) {
    next(error);
  }
};

const createMess = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Mess created' });
  } catch (error) {
    next(error);
  }
};

const updateMess = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Mess updated' });
  } catch (error) {
    next(error);
  }
};

const deleteMess = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Mess deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMesses,
  getMessById,
  createMess,
  updateMess,
  deleteMess,
};
