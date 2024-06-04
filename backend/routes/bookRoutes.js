const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../middleware/multer-config');

const bookCtrl = require('../controllers/bookCtrl');

router.get('/', bookCtrl.getAllBook);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, upload, resizeImage, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.createRating);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.put('/:id', auth, upload, resizeImage, bookCtrl.modifyBook);

module.exports = router;