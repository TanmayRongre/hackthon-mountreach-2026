const Student = require('../models/Student');
const User = require('../models/User');

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Public / Private
 */
const getStudents = async (req, res, next) => {
  try {
    const { department, hostel, year, status, search } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (hostel) filter.hostel = hostel;
    if (year) filter.year = year;
    if (status) filter.status = status;

    let students = await Student.find(filter)
      .populate('user', 'name email role')
      .populate('hostel', 'name code gender')
      .populate('room', 'roomNumber floor type')
      .populate('bed', 'bedNumber status')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      students = students.filter(
        (s) =>
          s.enrollmentNumber?.toLowerCase().includes(q) ||
          s.user?.name?.toLowerCase().includes(q) ||
          s.user?.email?.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student by ID
 * @route   GET /api/students/:id
 * @access  Public / Private
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('hostel', 'name code gender')
      .populate('room', 'roomNumber floor type rentPerMonth')
      .populate('bed', 'bedNumber status');

    if (!student) {
      res.status(404);
      throw new Error('Student record not found');
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new student record
 * @route   POST /api/students
 * @access  Private
 */
const createStudent = async (req, res, next) => {
  try {
    const {
      user,
      enrollmentNumber,
      department,
      year,
      hostel,
      room,
      bed,
      phone,
      parentName,
      parentPhone,
      address,
    } = req.body;

    if (!user || !enrollmentNumber) {
      res.status(400);
      throw new Error('Please provide user ID and enrollment number');
    }

    const existingStudent = await Student.findOne({ enrollmentNumber: enrollmentNumber.toUpperCase() });
    if (existingStudent) {
      res.status(400);
      throw new Error('A student with this enrollment ID already exists');
    }

    const student = await Student.create({
      user,
      enrollmentNumber: enrollmentNumber.toUpperCase(),
      department: department || 'Computer Science & Engineering',
      year: year || '1st Year',
      hostel: hostel || null,
      room: room || null,
      bed: bed || null,
      phone: phone || '',
      parentName: parentName || '',
      parentPhone: parentPhone || '',
      address: address || '',
    });

    const populated = await Student.findById(student._id)
      .populate('user', 'name email role')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor');

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student record
 * @route   PUT /api/students/:id
 * @access  Private
 */
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email role')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor')
      .populate('bed', 'bedNumber');

    if (!student) {
      res.status(404);
      throw new Error('Student record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student record
 * @route   DELETE /api/students/:id
 * @access  Private
 */
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student record not found');
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
