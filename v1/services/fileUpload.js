const multer = require('multer')
const path = require('path')
const { PATHS } = require('../../constants')





const PicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let paths = path.resolve(__dirname, '../../uploads');
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});
const Upload = multer({
    storage: PicStorage, fileFilter: (req, file, cb) => {
        if (file.mimetype) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})


module.exports = {
    Upload: Upload
};


