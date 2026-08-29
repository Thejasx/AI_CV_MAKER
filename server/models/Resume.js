const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled ATS Resume',
  },
  targetJobTitle: {
    type: String,
    default: '',
  },
  rawCVText: {
    type: String,
    default: '',
  },
  jobDescription: {
    type: String,
    default: '',
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  scoreBreakdown: {
    keywords: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    format: { type: Number, default: 0 },
  },
  matchedKeywords: [{ type: String }],
  missingKeywords: [{ type: String }],
  atsRecommendations: [{ type: String }],
  optimizedData: {
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
    },
    summary: String,
    workExperience: [
      {
        jobTitle: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        bulletPoints: [String],
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        location: String,
        graduationYear: String,
        details: String,
      },
    ],
    skills: {
      hardSkills: [String],
      softSkills: [String],
      tools: [String],
    },
    projects: [
      {
        name: String,
        technologies: String,
        link: String,
        bulletPoints: [String],
      },
    ],
    certifications: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
