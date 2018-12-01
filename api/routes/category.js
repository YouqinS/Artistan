const router = require('express').Router();
const upload = require('../../modules/multer');
const db = require('../database/db');
const passport = require('../../modules/passport-config');


/* get all category at GET: base_url/api/category/ */
router.get('/', db.Category.getAllCategory);

/*add category at POST: base_url/api/category/  */
router.post('/', passport.authenticate('jwt', {session: false}), upload.single(), db.Category.addCategory);

/*update a category with authentication at PATCH: base_url/api/catefory/:category_id  */
router.patch('/:category_id', passport.authenticate('jwt', {session: false}), upload.single(), db.Category.updateCategory);

/* delete category by category id with authentication at DELETE: base_url/api/category/:category_id */
router.delete('/:category_id', passport.authenticate('jwt', {session: false}), db.Category.deleteCategory);

module.exports = router;