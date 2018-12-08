const router = require('express').Router();
const db = require('../database/db');

router.get('/', db.Search.search);
router.get('/v2/:search_query', db.Search.searchVariant);

module.exports = router;
