const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  companyName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Applied',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

module.exports = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
