const ContactMessage = require('../models/ContactMessage');

/**
 * @desc    Submit a new contact / helpdesk ticket
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, inquiry, message } = req.body;

    if (!firstName || !email || !message) {
      res.status(400);
      throw new Error('Please provide first name, email, and message');
    }

    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTicket = await ContactMessage.create({
      ticketNumber,
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : '',
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      inquiry: inquiry || 'general',
      message: message.trim(),
      status: 'open',
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry ticket received successfully! Our hostel team will contact you within 24 hours.',
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact inquiries & tickets
 * @route   GET /api/contact
 * @access  Private (Admin / Warden)
 */
const getContactMessages = async (req, res, next) => {
  try {
    const { status, inquiry, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (inquiry) filter.inquiry = inquiry;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await ContactMessage.find(filter)
      .populate('respondedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update ticket status / resolution notes
 * @route   PUT /api/contact/:id
 * @access  Private (Admin / Warden)
 */
const updateContactMessage = async (req, res, next) => {
  try {
    const { status, responseNotes } = req.body;
    const ticket = await ContactMessage.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Inquiry ticket not found');
    }

    if (status) ticket.status = status;
    if (responseNotes) ticket.responseNotes = responseNotes.trim();
    if (req.user) ticket.respondedBy = req.user._id;

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContactMessages,
  updateContactMessage,
};
