const express = require('express');
const router = express.Router();
const comment = require('../controllers/commentControllers');

router.post('/create-comment/:articleId', comment.create);
router.get('/:id', comment.getAllComment);
router.put('/:id', comment.updateComment);
router.delete('/:id', comment.deleteComment);

module.exports = router;