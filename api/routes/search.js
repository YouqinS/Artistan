const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');

router.get('/', db.Search.search);

module.exports = router;