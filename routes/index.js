const express = require('express');
const router = express.Router();
const articleRouter = require('./articleRouters');
const commentRouter = require('./commentRouters');

router.use('/articles', articleRouter);
router.use('/comments', commentRouter);

module.exports = router;