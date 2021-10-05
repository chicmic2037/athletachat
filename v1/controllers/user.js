
const { MESSAGES, CODES } = require('../../constants')
const universal = require('../../utils')
module.exports = {

    uploadFile: async (req, res, next) => {
        try {
            return await universal.response(res, CODES.OK, MESSAGES.FILE_UPLOAD_SUCCESSFULLY, { image: `/uploads/${req.file.filename}` }, 'en');
        } catch (error) {
            next(error);
        }
    },
}

