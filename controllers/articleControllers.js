const Articles = require('../models/Articles');
const Joi = require('joi');

module.exports =  {
    create: async (req, res) => {
        const { title, content} = req.body;
        const file = req.file;
        
        try{
            const schema = Joi.object({
                title: Joi.string(),
                content: Joi.string(),
            })

            const { error } = schema.validate({...req.body}, {abortEarly: false});

            if(error) {
                res.status(400).json({
                    status: 'failed',
                    error: error['details'][0]['message']
                })
            }

            const createArticle = await Articles.create({
                title: title,
                content,
                image: file.path,
            });

            if(!createArticle) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'failed to create article',
                })
            };

            return res.status(200).json({
                status: 'success',
                message: 'successfully create article',
                dataArticle: createArticle,
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    readAll: async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = 5

        try{
            const article = await Articles.find().limit(limit).skip(limit * (page - 1));

            const count = await Articles.count();

            let next = page + 1
            if(page * limit >= count) {
                next = 0
            };

            let previous = 0
            if(page > 1) {
                previous = page - 1
            };

            let total = Math.ceil(count/limit);

            if(page > total) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'page not exist'
                })
            };

            return res.status(200).json({
                status: 'success',
                message: 'successfully retrieved data',
                data: article,
                totalPage: total,
                nextPage: next,
                currentPage: page,
                previousPage: previous,
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    readById: async (req, res) => {
        const id = req.params.id

        try{
            if(id.match(/^[0-9a-fA-F]{24}$/)) {
                const findArticle = await Articles.findById(id);

                if(!findArticle) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'data not found',
                    })
                };

                return res.status(200).json({
                    status: 'success',
                    message: 'successfully retrieved article',
                    articleData: findArticle
                });
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'data not found',
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    getByKeyword: async (req, res) => {
        const keyword = req.params.keyword;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;

        try {
            const findArticles = await Articles.find({ 'title': { $regex: new RegExp(keyword, 'gi')}})
            .limit(limit)
            .skip(limit * (page - 1))

            const count = await Articles.count({ 'title': { $regex: new RegExp(keyword, 'gi')}});

            let next = page + 1
            if (page * limit >= count) {
                next = 0
            }

            let previous = 0
            if (page > 1) {
                previous = page - 1
            }

            let total = Math.ceil(count / limit)

            if (page > total) {
                return res.status(400).json({
                    status: "failed",
                    message: "page doesnt exist"
                })
            }

            if (!findArticles) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'article not found'
                })
            }

            return res.status(200).json({
                status: 'success',
                message: 'successfully retrieved articles',
                articleData: findArticle,
                totalPage: total,
                nextPage: next,
                currentPage: page,
                previousPage: previous,
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    deleteArticle: async (req, res) => {
        const id = req.params.id;
        
        try{
            const findArticle = await Articles.findById(id);

            if(!findArticle) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'article not found'
                })
            };

            await Articles.findByIdAndRemove(id);

            return res.status(200).json({
                status: 'success',
                message: 'article successfully deleted',
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    updateArticle: async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        let file

        try {
            const findArticle = await Articles.findById(id);

            if(!findArticle) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'article not found',
                })
            };

            if(req.file) {
                file = req.file
            } else {
                file = Articles.image
            };

            if (!file.path) {
                Articles.image = Articles.image
            } else {
                Articles.image = file.path
            };

            Articles.title = body.title ? body.title : Articles.title
            Articles.content = body.content ? body.content : Articles.content
            
            await Articles.save()

            const updateArticle = await Articles.findById(id);

            return res.status(200).json({
                status: 'success',
                message: 'successfully update article',
                articleUpdate: updateArticle,
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },
};