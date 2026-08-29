const multer = require('multer');

// Store file in memory buffer for instant parsing without writing to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
  ];

  if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|doc|txt)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF, DOCX, DOC, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max limit
  },
  fileFilter,
});

module.exports = upload;
