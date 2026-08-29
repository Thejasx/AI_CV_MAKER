const { parseUploadedFile, sanitizeText } = require('../services/parseService');
const { optimizeResumeWithGemini } = require('../services/gemini');
const Resume = require('../models/Resume');
const { getIsConnected } = require('../config/db');

// In-memory store for guest/offline resumes
const memoryResumesStore = [];

/**
 * Parses uploaded document file (PDF or DOCX) into clean text string
 */
const parseCVFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX file.' });
    }

    const parsedText = await parseUploadedFile(req.file);
    
    res.status(200).json({
      success: true,
      filename: req.file.originalname,
      characterCount: parsedText.length,
      rawCVText: parsedText,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Accepts Raw CV text & Job Description, calls Gemini 1.5 Flash to optimize
 */
const optimizeCV = async (req, res) => {
  try {
    const { rawCVText, jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Job Description is required and should be at least 10 characters long.',
      });
    }

    const cleanCV = sanitizeText(rawCVText);
    const cleanJD = sanitizeText(jobDescription);

    console.log('[Gemini Engine] Processing resume optimization request...');
    const result = await optimizeResumeWithGemini(cleanCV, cleanJD);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Gemini Engine Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to optimize resume with Gemini AI.',
    });
  }
};

/**
 * Save resume to database or memory
 */
const saveResume = async (req, res) => {
  try {
    const { title, targetJobTitle, rawCVText, jobDescription, atsScore, scoreBreakdown, matchedKeywords, missingKeywords, atsRecommendations, optimizedData } = req.body;

    const resumePayload = {
      userId: req.user ? req.user.id : null,
      title: title || `Resume for ${targetJobTitle || 'Target Role'}`,
      targetJobTitle: targetJobTitle || optimizedData?.personalInfo?.fullName || 'Target Role',
      rawCVText,
      jobDescription,
      atsScore: atsScore || 0,
      scoreBreakdown: scoreBreakdown || {},
      matchedKeywords: matchedKeywords || [],
      missingKeywords: missingKeywords || [],
      atsRecommendations: atsRecommendations || [],
      optimizedData: optimizedData || {},
      updatedAt: new Date(),
    };

    if (getIsConnected()) {
      const savedResume = await Resume.create(resumePayload);
      return res.status(201).json({ success: true, resume: savedResume });
    } else {
      const memoryResume = { _id: 'mem_' + Date.now(), ...resumePayload, createdAt: new Date() };
      memoryResumesStore.push(memoryResume);
      return res.status(201).json({ success: true, resume: memoryResume, message: 'Saved to session storage' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get user saved resumes
 */
const getSavedResumes = async (req, res) => {
  try {
    if (getIsConnected() && req.user) {
      const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
      return res.status(200).json({ success: true, resumes });
    } else {
      const userResumes = memoryResumesStore.filter((r) => !req.user || r.userId === req.user?.id || !r.userId);
      return res.status(200).json({ success: true, resumes: userResumes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete saved resume
 */
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Resume.findByIdAndDelete(id);
    } else {
      const index = memoryResumesStore.findIndex((r) => r._id === id);
      if (index !== -1) memoryResumesStore.splice(index, 1);
    }
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  parseCVFile,
  optimizeCV,
  saveResume,
  getSavedResumes,
  deleteResume,
};
