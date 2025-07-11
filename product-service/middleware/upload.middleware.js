const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Create the uploads folder if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.fieldname === 'image') {
      const allowed = ['.jpg', '.jpeg', '.png', '.gif'];
      return allowed.includes(ext) ? cb(null, true) : cb(new Error('Invalid image'));
    }
    if (file.fieldname === 'model') {
      const allowed = ['.glb', '.gltf', '.fbx', '.obj'];
      return allowed.includes(ext) ? cb(null, true) : cb(new Error('Invalid 3D model'));
    }
    return cb(new Error('Invalid field'));
  }
});

module.exports = upload;
