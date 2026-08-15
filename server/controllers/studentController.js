const Student = require('../models/Student');
const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Fee = require('../models/Fee');

/**
 * @desc    Get current logged-in student's profile & admission status
 * @route   GET /api/students/me
 * @access  Private (Authenticated)
 */
const getMyStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email role')
      .populate('hostel', 'name code gender facilities description')
      .populate('room', 'roomNumber floor type rentPerMonth amenities capacity')
      .populate('bed', 'bedNumber status');

    if (!student) {
      return res.status(200).json({
        success: true,
        isAdmitted: false,
        student: null,
        message: 'No active student admission found. Please submit admission details.',
      });
    }

    res.status(200).json({
      success: true,
      isAdmitted: student.status === 'active',
      student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admit / Register current student to hostel
 * @route   POST /api/students/admit
 * @access  Private (Authenticated)
 */
const admitStudent = async (req, res, next) => {
  try {
    const {
      enrollmentNumber,
      department,
      year,
      hostelId,
      phone,
      parentName,
      parentPhone,
      address,
    } = req.body;

    if (!enrollmentNumber) {
      res.status(400);
      throw new Error('Please provide your enrollment / student ID number');
    }

    const cleanEnrollment = enrollmentNumber.trim().toUpperCase();

    // Check if enrollment number is taken by another user
    const existingEnrollment = await Student.findOne({
      enrollmentNumber: cleanEnrollment,
      user: { $ne: req.user._id },
    });
    if (existingEnrollment) {
      res.status(400);
      throw new Error('A student with this enrollment ID already exists');
    }

    // Determine Hostel
    let hostel = null;
    if (hostelId) {
      hostel = await Hostel.findById(hostelId);
    }
    if (!hostel) {
      hostel = await Hostel.findOne({}) || await Hostel.create({
        name: 'Sahyadri Boys Hostel (Block A)',
        code: 'SAY-A',
        gender: 'boys',
        facilities: ['High-speed Wi-Fi', '24/7 RO Water', 'Laundry', 'Gym'],
      });
    }

    // Determine / Assign Room
    let room = await Room.findOne({ hostel: hostel._id, status: 'available' });
    if (!room) {
      room = await Room.findOne({ hostel: hostel._id }) || await Room.create({
        roomNumber: '101',
        hostel: hostel._id,
        floor: 1,
        capacity: 2,
        type: 'AC',
        rentPerMonth: 6500,
        amenities: ['AC', 'Attached Bath', 'Study Desk'],
      });
    }

    // Determine Bed
    let bed = await Bed.findOne({ room: room._id, status: 'available' });
    if (!bed) {
      bed = await Bed.findOne({ room: room._id }) || await Bed.create({
        bedNumber: 'B-1',
        room: room._id,
        status: 'occupied',
      });
    }

    // Create or Update Student document
    let student = await Student.findOne({ user: req.user._id });

    if (student) {
      student.enrollmentNumber = cleanEnrollment;
      student.department = department || student.department || 'Computer Science & Engineering';
      student.year = year || student.year || '1st Year';
      student.hostel = hostel._id;
      student.room = room._id;
      student.bed = bed._id;
      student.phone = phone || student.phone || '';
      student.parentName = parentName || student.parentName || '';
      student.parentPhone = parentPhone || student.parentPhone || '';
      student.address = address || student.address || '';
      student.status = 'active';
      await student.save();
    } else {
      student = await Student.create({
        user: req.user._id,
        enrollmentNumber: cleanEnrollment,
        department: department || 'Computer Science & Engineering',
        year: year || '1st Year',
        hostel: hostel._id,
        room: room._id,
        bed: bed._id,
        phone: phone || '',
        parentName: parentName || '',
        parentPhone: parentPhone || '',
        address: address || '',
        status: 'active',
      });
    }

    // Seed initial fee record if none exists for this student
    const feeExists = await Fee.findOne({ student: req.user._id });
    if (!feeExists) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      await Fee.create({
        student: req.user._id,
        title: 'Semester 1 Hostel Fee (Room 101)',
        amount: room.rentPerMonth ? room.rentPerMonth * 6 : 36000,
        feeType: 'Hostel Fee',
        dueDate,
        status: 'pending',
      });
    }

    const populated = await Student.findById(student._id)
      .populate('user', 'name email role')
      .populate('hostel', 'name code gender facilities description')
      .populate('room', 'roomNumber floor type rentPerMonth amenities capacity')
      .populate('bed', 'bedNumber status');

    res.status(201).json({
      success: true,
      isAdmitted: true,
      message: '🎉 Congratulations! Hostel admission completed successfully.',
      student: populated,
    });
  } catch (error) {
    next(error);
  }
};

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
  getMyStudentProfile,
  admitStudent,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
