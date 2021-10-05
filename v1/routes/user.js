const router = require("express").Router();
const controllers = require('../controllers');
const service = require("../services");
/*
On-Boarding
*/

router.post("/upload", service.upload.Upload.single('file'), controllers.user.uploadFile)
module.exports = router