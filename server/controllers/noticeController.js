// noticeController.js
const getNotices = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all notices' });
  } catch (error) {
    next(error);
  }
};

const getNoticeById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get notice by id' });
  } catch (error) {
    next(error);
  }
};

const createNotice = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Notice created' });
  } catch (error) {
    next(error);
  }
};

const updateNotice = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Notice updated' });
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
