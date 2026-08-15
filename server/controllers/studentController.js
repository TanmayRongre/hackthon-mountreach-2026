// studentController.js
const getStudents = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all students' });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get student by id' });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Student created' });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Student updated' });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Student deleted' });
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
