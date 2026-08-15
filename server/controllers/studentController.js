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
 * @desc    Admit / Register current student to hostel with atomic bed assignment
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
      roomType = 'AC',
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

    // Get all rooms belonging to this hostel
    const hostelRooms = await Room.find({ hostel: hostel._id });
    const roomIds = hostelRooms.map((r) => r._id);

    let availableBed = await Bed.findOne({
      room: { $in: roomIds },
      status: 'available',
    }).populate('room');

    let room = availableBed?.room;

    // If no available bed in existing rooms, find or create an available room with beds
    if (!availableBed || !room) {
      let candidateRoom = hostelRooms.find((r) => (r.occupiedCount || 0) < (r.capacity || 2));

      if (!candidateRoom) {
        // Generate unique room number
        const existingRoomNums = new Set(hostelRooms.map((r) => r.roomNumber));
        let roomNumCandidate = 101;
        while (existingRoomNums.has(String(roomNumCandidate))) {
          roomNumCandidate++;
        }
        const nextRoomNum = String(roomNumCandidate);

        candidateRoom = await Room.create({
          roomNumber: nextRoomNum,
          hostel: hostel._id,
          floor: Math.floor((roomNumCandidate - 100) / 10) + 1,
          capacity: 2,
          type: roomType || 'AC',
          rentPerMonth: roomType === 'Non-AC' ? 4500 : roomType === 'Deluxe' ? 7500 : 6500,
          amenities: ['AC', 'Attached Bath', 'Study Desk', 'Cupboard'],
          occupiedCount: 0,
          status: 'available',
        });
      }

      // Check if bed exists in candidateRoom, else create beds
      availableBed = await Bed.findOne({ room: candidateRoom._id, status: 'available' });
      if (!availableBed) {
        const existingBedsInRoom = await Bed.find({ room: candidateRoom._id });
        const nextBedIndex = existingBedsInRoom.length + 1;
        availableBed = await Bed.create({
          bedNumber: `Bed-${nextBedIndex}`,
          room: candidateRoom._id,
          hostel: hostel._id,
          status: 'available',
        });
      }
      room = candidateRoom;
    }

    if (!availableBed) {
      res.status(400);
      throw new Error('Hostel is currently at full capacity. No vacant beds available.');
    }

    // Mark bed as occupied
    availableBed.status = 'occupied';
    availableBed.student = req.user._id;
    await availableBed.save();

    // Update room occupancy
    const roomBeds = await Bed.find({ room: room._id });
    const occupiedCount = roomBeds.filter((b) => b.status === 'occupied').length;
    room.occupiedCount = occupiedCount;
    room.status = occupiedCount >= room.capacity ? 'full' : 'available';
    await room.save();

    // Create or Update Student document
    let student = await Student.findOne({ user: req.user._id });

    if (student) {
      student.enrollmentNumber = cleanEnrollment;
      student.department = department || student.department || 'Computer Science & Engineering';
      student.year = year || student.year || '1st Year';
      student.hostel = hostel._id;
      student.room = room._id;
      student.bed = availableBed._id;
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
        bed: availableBed._id,
        phone: phone || '',
        parentName: parentName || '',
        parentPhone: parentPhone || '',
        address: address || '',
        status: 'active',
      });
    }

    // Seed initial fee record if none exists for this student
    const feeExists = await Fee.findOne({ student: req.user._id, feeType: 'Hostel Fee' });
    if (!feeExists) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      const semRent = (room.rentPerMonth || 6500) * 6;
      const messFee = 24000;
      const caution = 5000;
      const totalAmount = semRent + messFee + caution;

      await Fee.create({
        student: req.user._id,
        title: `Semester 1 Hostel & Mess Fee (Room ${room.roomNumber})`,
        amount: totalAmount,
        feeType: 'Hostel Fee',
        dueDate,
        status: 'pending',
        receiptNumber: `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
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
      message: `🎉 Admission confirmed! Allotted Room ${room.roomNumber}, ${availableBed.bedNumber} in ${hostel.name}.`,
      student: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students (scoped by role)
 * @route   GET /api/students
 * @access  Private
 */
const getStudents = async (req, res, next) => {
  try {
    const { department, hostel, year, status, search } = req.query;
    const filter = {};

    // Role-based data scoping
    if (req.user.role === 'student') {
      filter.user = req.user._id;
    } else if (req.user.role === 'warden') {
      const assignedHostels = await Hostel.find({ warden: req.user._id }).select('_id');
      const hostelIds = assignedHostels.map((h) => h._id);
      if (hostelIds.length > 0) {
        filter.hostel = { $in: hostelIds };
      }
    }

    if (department) filter.department = department;
    if (hostel && req.user.role !== 'student') filter.hostel = hostel;
    if (year) filter.year = year;
    if (status) filter.status = status;

    let students = await Student.find(filter)
      .populate('user', 'name email role')
      .populate('hostel', 'name code gender')
      .populate('room', 'roomNumber floor type rentPerMonth')
      .populate('bed', 'bedNumber status')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      students = students.filter(
        (s) =>
          s.enrollmentNumber?.toLowerCase().includes(q) ||
          s.user?.name?.toLowerCase().includes(q) ||
          s.user?.email?.toLowerCase().includes(q) ||
          s.room?.roomNumber?.toLowerCase().includes(q)
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
 * @desc    Get student by ID (scoped by role)
 * @route   GET /api/students/:id
 * @access  Private
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

    // Role check: student can only view self
    if (req.user.role === 'student' && !student.user._id.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to access another student profile');
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
 * @access  Private (Admin / Warden)
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
 * @access  Private (Admin / Warden)
 */
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email role')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor type')
      .populate('bed', 'bedNumber status');

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
 * @access  Private (Admin)
 */
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student record not found');
    }

    // Release assigned bed if occupied
    if (student.bed) {
      await Bed.findByIdAndUpdate(student.bed, { status: 'available', student: null });
    }

    // Decrement room occupancy
    if (student.room) {
      const room = await Room.findById(student.room);
      if (room) {
        room.occupiedCount = Math.max(0, (room.occupiedCount || 1) - 1);
        room.status = 'available';
        await room.save();
      }
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student record and bed allocation removed successfully',
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
