const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ tệp tin
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../Image'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Đảm bảo tên tệp là duy nhất bằng cách thêm thời gian hoặc UUID
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
