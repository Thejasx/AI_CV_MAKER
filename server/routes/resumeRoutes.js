const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  parseCVFile,
  optimizeCV,
  saveResume,
  getSavedResumes,
  deleteResume,
} = require('../controllers/resumeController');

router.post('/parse-file', upload.single('file'), parseCVFile);
router.post('/optimize', optimizeCV);
router.post('/save', protect, saveResume);
router.get('/saved', protect, getSavedResumes);
router.delete('/delete/:id', protect, deleteResume);

module.exports = router;
