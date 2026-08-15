const Notice = require('../models/Notice');

const defaultNotices = [
  {
    title: '📢 Hostel Night Entry & Curfew Timings for 2026 Academic Session',
    content: 'All resident students are hereby notified that the main hostel gates will close strictly at 10:00 PM on weekdays and 10:30 PM on weekends. Late entries without a valid approved digital outpass will require warden clearance.',
    category: 'Rules & Discipline',
    priority: 'high',
    targetAudience: 'students',
    isActive: true,
  },
  {
    title: '🍱 Central Mess Special Sunday Feast & Feedback Drive',
    content: 'Special lunch feast will be served this Sunday. Resident students are encouraged to submit mess committee suggestions through the student portal feedback form.',
    category: 'Mess',
    priority: 'normal',
    targetAudience: 'all',
    isActive: true,
  },
  {
    title: '⚡ Bi-weekly Room Electrical & Wi-Fi Router Maintenance',
    content: 'The campus IT and maintenance team will conduct routine Wi-Fi router speed upgrades and electrical safety inspections across Sahyadri Block A and Nilgiri Block B this Saturday between 11:00 AM and 3:00 PM.',
    category: 'Maintenance',
    priority: 'normal',
    targetAudience: 'students',
    isActive: true,
  },
];

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

    let notices = await Notice.find(filter)
      .populate('postedBy', 'name email role')
      .populate('hostel', 'name code')
      .sort({ createdAt: -1 });

    // Auto-seed default notices if empty
    if (notices.length === 0 && Object.keys(filter).length <= 1) {
      const adminUser = await require('../models/User').findOne({ role: 'admin' }) || await require('../models/User').findOne();
      if (adminUser) {
        const seeded = defaultNotices.map((n) => ({ ...n, postedBy: adminUser._id }));
        await Notice.insertMany(seeded);
        notices = await Notice.find(filter)
          .populate('postedBy', 'name email role')
          .populate('hostel', 'name code')
          .sort({ createdAt: -1 });
      }
    }

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
 * @access  Private (Admin / Warden)
 */
const createNotice = async (req, res, next) => {
  try {
    const { title, content, category, priority, targetAudience, hostel, expiryDate } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error('Please provide notice title and content');
    }

    let postedBy = req.user ? req.user._id : req.body.postedBy;
    if (!postedBy) {
      const User = require('../models/User');
      const author = await User.findOne({ role: { $in: ['admin', 'warden'] } }) || await User.findOne();
      if (author) postedBy = author._id;
    }

    if (!postedBy) {
      res.status(400);
      throw new Error('Please specify author');
    }

    const notice = await Notice.create({
      title: title.trim(),
      content: content.trim(),
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
 * @access  Private (Admin / Warden)
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
 * @access  Private (Admin / Warden)
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
