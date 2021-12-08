const express = require('express');
const router = express.Router();
const article = require('../controllers/articleControllers');
const uploadImage = require('../middlewares/uploadImage');

router.post('/create', uploadImage('image'), article.create);
router.get('/', article.readAll);
router.get('/:id', article.readById);
router.get('/:keyword', article.getByKeyword);
router.put('/:id', article.updateArticle);
router.delete('/:id', article.deleteArticle);

module.exports = router;