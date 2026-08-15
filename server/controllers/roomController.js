// roomController.js
const getRooms = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all rooms' });
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get room by id' });
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Room created' });
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Room updated' });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Room deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
