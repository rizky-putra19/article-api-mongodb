const Comments = require('../models/Comments');
const Articles = require('../models/Articles');

module.exports = {
    create: async (req, res) => {
        const body = req.body;
        const id = req.params.articleId;

        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const findArticle = await Articles.findById(id)

                if (!findArticle) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'article not found',
                    })
                };

                const saveComment = await Comments.create({
                    articleId: id,
                    content: body.content,
                });

                findArticle.comment.unshift(saveComment._id)

                await findArticle.save()

                return res.status(200).json({
                    status: 'success',
                    message: 'comment successfully post',
                    commentData: saveComment,
                })
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'article doesnt exist or not found',
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    getAllComment: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const id = req.params.id;

        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const comments = await Comments.find({ articleId: id });
                const findComment = await Comments.find({ articleId: id }).limit(limit * page);

                return res.status(200).json({
                    status: 'success',
                    message: 'success read all comment',
                    dataComment: findComment,
                    totalPage: Math.ceil(comments.length / limit),
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    updateComment: async (req, res) => {
        const content = req.params.id;
        const body = req.body;

        try {
            if (content.match(/^[0-9a-fA-F]{24}$/)) {
                const updateComment = await Comments.findOneAndUpdate({ _id: content }, body, { returnOriginal: false });

                if (!updateComment) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'not authorized',
                    })
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'success update comment',
                    dataComment: updateComment,
                })
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'update failed',
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    deleteComment: async (req, res) => {
        const id = req.params.id;

        try {
            const findComment = await Comments.findOne({_id: id});

            if(!findComment) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'comment not found',
                })
            }

            const findArticle = await Articles.findById(findComment.articleId)
            await findArticle.comment.pull(id)
            await findArticle.save()

            const deleteComment = await Comments.deleteOne({_id: id})

            if(!deleteComment.deletedCount) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'comment doesnt exist',
                })
            }

            return res.status(200).json({
                status: 'success',
                message: 'successfully delete comment',
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    }
}