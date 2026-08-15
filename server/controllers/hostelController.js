// hostelController.js
const getHostels = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all hostels' });
  } catch (error) {
    next(error);
  }
};

const getHostelById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get hostel by id' });
  } catch (error) {
    next(error);
  }
};

const createHostel = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Hostel created' });
  } catch (error) {
    next(error);
  }
};

const updateHostel = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Hostel updated' });
  } catch (error) {
    next(error);
  }
};

const deleteHostel = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Hostel deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
};
