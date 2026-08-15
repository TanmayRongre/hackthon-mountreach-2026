// bedController.js
const getBeds = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all beds' });
  } catch (error) {
    next(error);
  }
};

const getBedById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get bed by id' });
  } catch (error) {
    next(error);
  }
};

const createBed = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Bed created' });
  } catch (error) {
    next(error);
  }
};

const updateBed = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Bed updated' });
  } catch (error) {
    next(error);
  }
};

const deleteBed = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Bed deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed,
};
