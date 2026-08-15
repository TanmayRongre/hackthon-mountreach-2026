const Notice = require('../models/Notice');

/**
 * @desc    Get all notices
 * @route   GET /api/notices
 * @access  Public
 */
const getNotices = async (req, res, next) => {
  try {
    const { category, targetAudience, hostel } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (hostel) filter.hostel = hostel;

    const notices = await Notice.find(filter)
      .populate('postedBy', 'name email role')
      .populate('hostel', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single notice by ID
 * @route   GET /api/notices/:id
 * @access  Public
 */
const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('postedBy', 'name email role')
      .populate('hostel', 'name code');

    if (!notice) {
      res.status(404);
      throw new Error('Notice not found');
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new notice
 * @route   POST /api/notices
 * @access  Private
 */
const createNotice = async (req, res, next) => {
  try {
    const { title, content, category, priority, targetAudience, hostel, expiryDate } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error('Please provide notice title and content');
    }

    const postedBy = req.user ? req.user._id : req.body.postedBy;
    if (!postedBy) {
      res.status(400);
      throw new Error('Please specify author');
    }

    const notice = await Notice.create({
      title,
      content,
      category: category || 'General',
      priority: priority || 'normal',
      targetAudience: targetAudience || 'all',
      hostel: hostel || null,
      postedBy,
      expiryDate: expiryDate || null,
      isActive: true,
    });

    const populated = await Notice.findById(notice._id).populate('postedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Notice published successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update notice
 * @route   PUT /api/notices/:id
 * @access  Private
 */
const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('postedBy', 'name email');

    if (!notice) {
      res.status(404);
      throw new Error('Notice not found');
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete notice
 * @route   DELETE /api/notices/:id
 * @access  Private
 */
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      res.status(404);
      throw new Error('Notice not found');
    }

    await notice.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully',
    });
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
